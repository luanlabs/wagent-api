const assert = require('node:assert/strict');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const { createServer } = require('node:net');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test, before, after, mock } = require('node:test');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const { Keypair } = require('@stellar/stellar-sdk');

const startMongo = require('./helpers/mongo.cjs');
const env = require('./helpers/env.cjs');
const nativeFetch = global.fetch;
const wallets = new Map();
const sessions = new Map();
const mail = [];
const records = [];
const expiryTimers = [];
let dir, mongo, server, baseUrl, app, models, merchant, admin, jwt, log;
let bluxUnavailable = false;
let nextBluxId = 1;

async function request(method, path, { body, raw, headers = {} } = {}) {
  const response = await nativeFetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body !== undefined || raw !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  const text = await response.text();
  const content =
    text && response.headers.get('content-type')?.includes('application/json')
      ? JSON.parse(text)
      : text;
  return { status: response.status, body: content, headers: response.headers };
}

async function expectResponse(method, path, status, options) {
  const response = await request(method, path, options);
  assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(response.body)}`);
  return response.body;
}

const bearer = (user) => ({ authorization: `Bearer ${jwt.sign(String(user._id))}` });
const apiKey = (user) => ({ apikey: user.apiKey });

async function createUser(overrides = {}) {
  const address = Keypair.random().publicKey();
  const bluxUserId = nextBluxId++;
  wallets.set(address, bluxUserId);
  return models.User.create({
    name: 'Test store',
    address,
    bluxUserId,
    email: `merchant${bluxUserId}@example.test`,
    apiKey: `test-api-key-${bluxUserId}`,
    subscribeToken: `test-subscription-${bluxUserId}`,
    minimumCancellableStreamDuration: 0,
    ...overrides,
  });
}

async function createOrder(user = merchant, overrides = {}) {
  return models.Order.create({
    initialAmount: '10000000',
    amount: '1.0200',
    user: user._id,
    currency: 'usd',
    memo: new mongoose.Types.ObjectId().toString(),
    status: 'pending',
    expiredTimestamp: Date.now() + 900_000,
    redirectUrl: 'https://shop.example.test/complete',
    isTransfer: false,
    ...overrides,
  });
}

before(
  async () => {
    dir = await mkdtemp(join(tmpdir(), 'wagent-routes-test-'));
    Object.assign(process.env, env, { LOG_FILE_PATH: join(dir, 'api.log') });
    delete process.env.CORS_ORIGIN;

    const nativeSetTimeout = global.setTimeout;
    mock.method(global, 'setTimeout', (callback, delay, ...args) => {
      const timer = nativeSetTimeout(callback, delay, ...args);
      if (delay === 900_000) expiryTimers.push(timer);
      return timer;
    });

    mock.method(nodemailer, 'createTransport', () => ({
      verify: (callback) => callback(null, true),
      sendMail: (options, callback) => {
        mail.push(options);
        callback(null, { response: 'test mail accepted' });
      },
    }));
    mock.method(global, 'fetch', async (url, options) => {
      assert.equal(new URL(url).origin, 'https://api.blux.cc', 'Unexpected external request');
      if (bluxUnavailable) throw new Error('Simulated Blux outage');
      const path = new URL(url).pathname;
      if (path === '/users') {
        const token = options.headers.Authorization.replace('Bearer ', '');
        const identity = sessions.get(token);
        return Response.json(identity ? { result: identity } : { error: 'Invalid session' }, {
          status: identity ? 200 : 401,
        });
      }
      assert.equal(options.headers['blux-app-secret'], env.BLUX_APP_SECRET);
      if (path === '/server/wallets/verify') {
        const { address, user_id } = JSON.parse(options.body);
        const owner = wallets.get(address);
        return Response.json({
          result: {
            exists: !!owner && (!user_id || user_id === owner),
            user_id: owner,
            network: 'stellar',
          },
        });
      }
      return Response.json({ error: 'Not found' }, { status: 404 });
    });

    mongo = await startMongo();
    await mongoose.connect(mongo.uri, { dbName: 'wagent_test', serverSelectionTimeoutMS: 5000 });
    app = require('../dist/app').default;
    jwt = require('../dist/utils/jwt');
    log = require('../dist/config/logger').default;
    log.addStream({
      type: 'raw',
      level: 'trace',
      stream: { write: (record) => records.push(record) },
    });
    models = Object.fromEntries(
      ['User', 'Token', 'UserToken', 'Order', 'OrderToken', 'Currency', 'Transaction'].map(
        (name) => [name, require(`../dist/models/${name}`).default],
      ),
    );
    await Promise.all(Object.values(models).map((model) => model.init()));
    merchant = await createUser();
    admin = await createUser({ isAdmin: true });
    await models.Currency.create([
      { name: 'usd', rate: 1 },
      { name: 'xlm', rate: 10 },
    ]);
    const token = await models.Token.create({
      logo: 'https://example.test/xlm.png',
      symbol: 'xlm',
      address: 'native',
    });
    await models.UserToken.create({ user: merchant._id, token: token._id });
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  },
  { timeout: 30_000 },
);

after(async () => {
  if (server) {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  }
  // Order model hooks schedule expiry timers. Release them before closing MongoDB.
  for (const timer of expiryTimers) clearTimeout(timer);
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
  if (log) {
    await Promise.all(
      log.streams.filter((s) => s.path).map((s) => new Promise((resolve) => s.stream.end(resolve))),
    );
  }
  if (dir) await rm(dir, { recursive: true, force: true });
  mock.restoreAll();
});

test('health, Swagger, unknown routes, HEAD and CORS preflight', async () => {
  const health = await expectResponse('GET', '/health', 200);
  assert.equal(health.db, 'connected');
  const head = await request('HEAD', '/health');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  const docs = await request('GET', '/swagger/');
  assert.equal(docs.status, 200);
  assert.match(docs.body, /Swagger UI/);
  await expectResponse('GET', '/swagger/swagger-ui.css', 200);
  assert.equal((await expectResponse('GET', '/missing', 404)).message, 'Not Found');
  await expectResponse('PATCH', '/orders/anything', 404);
  const cors = await request('OPTIONS', '/orders', {
    headers: { origin: 'https://shop.example.test', 'access-control-request-method': 'POST' },
  });
  assert.equal(cors.status, 204);
  assert.equal(cors.headers.get('access-control-allow-origin'), 'https://shop.example.test');
  assert.equal(head.headers.has('x-powered-by'), false);
});

test('all protected routes reject missing, malformed and invalid credentials', async () => {
  for (const [method, path] of [
    ['GET', '/users'],
    ['PUT', '/users'],
    ['PUT', '/users/api-key'],
    ['GET', '/users/transactions'],
    ['POST', '/users/auth/authenticator'],
    ['PUT', '/users/auth/authenticator'],
    ['POST', '/tokens'],
    ['PUT', '/tokens/xlm'],
    ['DELETE', '/tokens/xlm'],
  ]) {
    for (const authorization of [undefined, 'Basic invalid', 'Bearer invalid']) {
      await expectResponse(method, path, 401, {
        headers: authorization ? { authorization } : {},
        body: method === 'GET' ? undefined : {},
      });
    }
  }
  await expectResponse('POST', '/orders', 400, { body: {} });
  await expectResponse('POST', '/orders', 400, { body: {}, headers: { apikey: 'invalid-key' } });
  const absent = new mongoose.Types.ObjectId();
  await expectResponse('GET', '/users', 401, {
    headers: { authorization: `Bearer ${jwt.sign(String(absent))}` },
  });
  for (const [method, path] of [
    ['POST', '/tokens'],
    ['PUT', '/tokens/xlm'],
    ['DELETE', '/tokens/xlm'],
  ]) {
    await expectResponse(method, path, 401, { headers: bearer(merchant), body: {} });
  }
});

test('all body validators reject invalid input without touching persistent state', async () => {
  for (const [method, path, headers] of [
    ['POST', '/users/auth', {}],
    ['POST', '/users/auth/login', {}],
    ['POST', '/users/auth/reset', {}],
    ['PUT', '/users/auth/reset', {}],
    ['POST', '/users/auth/verify', {}],
    ['PUT', '/users/auth/verify', {}],
    ['PUT', '/users/auth/authenticator', bearer(merchant)],
    ['PUT', '/users/subscription', {}],
    ['POST', '/orders', apiKey(merchant)],
    ['POST', '/tokens', bearer(admin)],
    ['PUT', '/tokens/xlm', bearer(admin)],
  ]) {
    const response = await expectResponse(method, path, 400, { headers, body: {} });
    assert.ok(Array.isArray(response.message));
  }
  await expectResponse('PUT', '/users', 400, { headers: bearer(merchant), body: { methods: 8 } });
  const before = await models.UserToken.find({ user: merchant._id }).lean();
  await expectResponse('PUT', '/users', 400, {
    headers: bearer(merchant),
    body: { tokens: ['invalid-object-id'] },
  });
  assert.deepEqual(await models.UserToken.find({ user: merchant._id }).lean(), before);
  for (const method of ['GET', 'PUT', 'DELETE']) {
    await expectResponse(method, '/orders/invalid-id', 400, {
      body: method === 'PUT' ? { email: 'payer@example.test' } : undefined,
    });
  }
  await expectResponse('POST', '/orders', 400, {
    headers: apiKey(merchant),
    body: { amount: -1, redirectUrl: 'bad-url' },
  });
});

test('Blux registration and login create a merchant once and reject bad sessions and outages', async () => {
  const address = Keypair.random().publicKey();
  const owner = nextBluxId++;
  wallets.set(address, owner);
  sessions.set('valid-session', {
    public_key: address,
    auth_value: 'Blux+User@Example.test',
    auth_method: 'email',
  });
  const registration = await expectResponse('POST', '/users/auth', 200, {
    body: { bluxToken: 'valid-session' },
  });
  assert.equal(registration.result.address, address);
  assert.ok(jwt.verify(registration.result.token));
  const login = await expectResponse('POST', '/users/auth/login', 200, {
    body: { bluxToken: 'valid-session' },
  });
  assert.equal(login.result.address, address);
  assert.equal(await models.User.countDocuments({ address }), 1);
  const user = await models.User.findOne({ address });
  assert.equal(user.email, 'blux+user@example.test');
  assert.equal(await models.UserToken.countDocuments({ user: user._id }), 1);
  await expectResponse('POST', '/users/auth/login', 401, {
    body: { bluxToken: 'invalid-session' },
  });
  sessions.set('bad-wallet', { public_key: 'invalid-address' });
  await expectResponse('POST', '/users/auth/login', 401, { body: { bluxToken: 'bad-wallet' } });
  bluxUnavailable = true;
  try {
    await expectResponse('POST', '/users/auth/login', 503, {
      body: { bluxToken: 'valid-session' },
    });
    const uncached = await createUser();
    await expectResponse('GET', '/users', 503, { headers: bearer(uncached) });
  } finally {
    bluxUnavailable = false;
  }
});

test('user details, settings, API key rotation and subscriptions persist changes', async () => {
  const details = await expectResponse('GET', '/users', 200, { headers: bearer(merchant) });
  assert.equal(details.result.address, merchant.address);
  assert.equal(details.result.tokens[0].symbol, 'xlm');
  const token = await models.Token.findOne({ symbol: 'xlm' });
  await expectResponse('PUT', '/users', 200, {
    headers: bearer(merchant),
    body: {
      name: 'New store',
      logo: 'https://example.test/store.png',
      methods: 7,
      isSubscribed: false,
      tokens: [String(token._id)],
      minimumCancellableStreamDuration: 60,
    },
  });
  let user = await models.User.findById(merchant._id);
  assert.equal(user.name, 'New store');
  assert.equal(user.methods, 7);
  assert.equal(user.isSubscribed, false);
  assert.equal(user.minimumCancellableStreamDuration, 60);
  await expectResponse('PUT', '/users/subscription', 200, {
    body: { token: merchant.subscribeToken, isSubscribed: true },
  });
  user = await models.User.findById(merchant._id);
  assert.equal(user.isSubscribed, true);
  await expectResponse('PUT', '/users/subscription', 404, {
    body: { token: 'unknown-subscription', isSubscribed: false },
  });
  const rotation = await expectResponse('PUT', '/users/api-key', 200, {
    headers: bearer(merchant),
  });
  assert.notEqual(rotation.result, merchant.apiKey);
  await expectResponse('POST', '/orders', 400, { headers: apiKey(merchant), body: {} });
  merchant = await models.User.findById(merchant._id);
  assert.equal(merchant.apiKey, rotation.result);
});

test('password reset validates tokens, hashes the password, expires tokens and throttles repeat requests', async () => {
  const user = await createUser({ email: 'reset+shop@example.test', password: 'old-password' });
  await expectResponse('POST', '/users/auth/reset', 200, {
    body: { email: 'RESET+SHOP@EXAMPLE.TEST' },
  });
  let saved = await models.User.findById(user._id);
  const token = saved.resetPasswordToken;
  assert.ok(token);
  assert.ok(mail.some((message) => message.to === 'RESET+SHOP@EXAMPLE.TEST'));
  await expectResponse('POST', '/users/auth/reset', 429, { body: { email: user.email } });
  await expectResponse('GET', `/users/auth/reset/${token}`, 200);
  await expectResponse('PUT', '/users/auth/reset', 200, {
    body: { token, password: 'new-password' },
  });
  saved = await models.User.findById(user._id);
  assert.equal(await saved.matchPassword('new-password'), true);
  assert.notEqual(saved.password, 'new-password');
  assert.equal(saved.resetPasswordToken, '');
  await expectResponse('GET', `/users/auth/reset/${token}`, 404);
  await expectResponse('PUT', '/users/auth/reset', 404, {
    body: { token, password: 'another-password' },
  });
  await expectResponse('POST', '/users/auth/reset', 404, {
    body: { email: 'missing@example.test' },
  });
  const expired = await createUser({
    resetPasswordToken: 'expired-reset',
    resetPasswordTokenExpiration: Date.now() - 1,
  });
  await expectResponse('GET', '/users/auth/reset/expired-reset', 404);
  await expectResponse('PUT', '/users/auth/reset', 404, {
    body: { token: expired.resetPasswordToken, password: 'new-password' },
  });
});

test('email verification handles valid, missing, used and expired tokens', async () => {
  const user = await createUser({ email: 'verify+shop@example.test', isVerified: false });
  await expectResponse('POST', '/users/auth/verify', 201, {
    body: { email: 'VERIFY+SHOP@EXAMPLE.TEST' },
  });
  let saved = await models.User.findById(user._id);
  const token = saved.verificationToken;
  assert.ok(token);
  await expectResponse('PUT', '/users/auth/verify', 200, { body: { token } });
  saved = await models.User.findById(user._id);
  assert.equal(saved.isVerified, true);
  assert.equal(saved.verificationToken, '');
  await expectResponse('PUT', '/users/auth/verify', 404, { body: { token } });
  await expectResponse('POST', '/users/auth/verify', 401, { body: { email: user.email } });
  await expectResponse('POST', '/users/auth/verify', 404, {
    body: { email: 'missing@example.test' },
  });
  await createUser({
    verificationToken: 'expired-verification',
    verificationTokenExpiration: Date.now() - 1,
  });
  await expectResponse('PUT', '/users/auth/verify', 404, {
    body: { token: 'expired-verification' },
  });
});

test('authenticator setup generates a QR code and only enables with a valid TOTP', async () => {
  const user = await createUser();
  await expectResponse('PUT', '/users/auth/authenticator', 400, {
    headers: bearer(user),
    body: { token: '123456' },
  });
  const setup = await expectResponse('POST', '/users/auth/authenticator', 200, {
    headers: bearer(user),
  });
  assert.ok(setup.result.secretKey);
  assert.match(setup.result.qrcode, /^data:image\//);
  await expectResponse('PUT', '/users/auth/authenticator', 400, {
    headers: bearer(user),
    body: { token: 'abcdef' },
  });
  const token = speakeasy.totp({ secret: setup.result.secretKey, encoding: 'base32' });
  const enable = await expectResponse('PUT', '/users/auth/authenticator', 200, {
    headers: bearer(user),
    body: { token },
  });
  assert.equal(enable.result.isVerify, true);
  assert.equal((await models.User.findById(user._id)).isAuthenticatorEnable, true);
  await expectResponse('POST', '/users/auth/authenticator', 400, { headers: bearer(user) });
  await expectResponse('PUT', '/users/auth/authenticator', 400, {
    headers: bearer(user),
    body: { token },
  });
});

test('token CRUD, duplicates, case-insensitive lookup and missing symbols', async () => {
  const tokens = await expectResponse('GET', '/tokens', 200);
  assert.ok(tokens.result.some((token) => token.symbol === 'xlm'));
  const input = {
    symbol: 'test.coin',
    logo: 'https://example.test/test-token.png',
    address: 'test-token-address',
  };
  const created = await expectResponse('POST', '/tokens', 201, {
    headers: bearer(admin),
    body: input,
  });
  assert.equal(created.result.symbol, input.symbol);
  await expectResponse('POST', '/tokens', 400, {
    headers: bearer(admin),
    body: { ...input, symbol: 'TEST.COIN' },
  });
  const updated = await expectResponse('PUT', '/tokens/TEST.COIN', 200, {
    headers: bearer(admin),
    body: { logo: 'https://example.test/new-token.png' },
  });
  assert.equal(updated.result.logo, 'https://example.test/new-token.png');
  assert.equal(
    (await models.Token.findById(created.result._id)).logo,
    'https://example.test/new-token.png',
  );
  await models.UserToken.create({ user: merchant._id, token: created.result._id });
  await expectResponse('PUT', '/tokens/[', 404, {
    headers: bearer(admin),
    body: { logo: 'https://example.test/missing.png' },
  });
  await expectResponse('DELETE', '/tokens/%2E%2B', 404, { headers: bearer(admin) });
  assert.equal(records.at(-1).route, '/tokens/:symbol');
  await expectResponse('DELETE', '/tokens/coin', 404, { headers: bearer(admin) });
  await expectResponse('DELETE', '/tokens/TEST.COIN', 200, { headers: bearer(admin) });
  assert.equal(await models.UserToken.countDocuments({ token: created.result._id }), 0);
  await expectResponse('PUT', '/tokens/missing', 404, {
    headers: bearer(admin),
    body: { logo: 'https://example.test/missing.png' },
  });
  await expectResponse('DELETE', '/tokens/missing', 404, { headers: bearer(admin) });
});

test('order creation, retrieval, payer email, cancellation and expiry use real MongoDB records', async () => {
  const created = await expectResponse('POST', '/orders', 200, {
    headers: apiKey(merchant),
    body: {
      amount: '10000000',
      currency: 'USD',
      redirectUrl: 'https://shop.example.test/complete',
      products: [{ count: 1, amount: '10000000', name: 'Product' }],
    },
  });
  const { id, url } = created.result;
  assert.equal(url, `${env.PAYMENT_URL}/${id}`);
  const saved = await models.Order.findById(id);
  assert.equal(saved.amount, '1.0200');
  assert.equal(saved.currency, 'usd');
  const amounts = await models.OrderToken.findOne({ order: id });
  assert.equal(amounts.amount, '10.2510000');
  assert.equal(amounts.initialAmount, '10.2000000');
  const order = await expectResponse('GET', `/orders/${id}`, 200);
  assert.equal(order.result.user.name, merchant.name);
  assert.equal(order.result.tokens[0].token.symbol, 'xlm');
  await expectResponse('PUT', `/orders/${id}`, 400, { body: { email: 'bad-email' } });
  await expectResponse('PUT', `/orders/${id}`, 200, { body: { email: 'payer@example.test' } });
  assert.equal((await models.Order.findById(id)).payerEmail, 'payer@example.test');
  await expectResponse('DELETE', `/orders/${id}`, 200);
  assert.equal((await models.Order.findById(id)).status, 'cancelled');
  await expectResponse('DELETE', `/orders/${id}`, 200);
  const expired = await createOrder(merchant, { expiredTimestamp: Date.now() - 1 });
  assert.equal(
    (await expectResponse('GET', `/orders/${expired._id}`, 200)).result.status,
    'expired',
  );
  const completed = await createOrder(merchant, { status: 'completed' });
  await expectResponse('DELETE', `/orders/${completed._id}`, 200);
  await expectResponse('PUT', `/orders/${completed._id}`, 200, {
    body: { email: 'other@example.test' },
  });
  const completedSaved = await models.Order.findById(completed._id);
  assert.equal(completedSaved.status, 'completed');
  assert.equal(completedSaved.payerEmail, undefined);
  const absent = new mongoose.Types.ObjectId();
  for (const method of ['GET', 'PUT', 'DELETE']) {
    await expectResponse(method, `/orders/${absent}`, 404, {
      body: method === 'PUT' ? { email: 'payer@example.test' } : undefined,
    });
  }
  await expectResponse('POST', '/orders', 400, {
    headers: apiKey(merchant),
    body: { amount: 1, currency: 'missing', redirectUrl: 'https://shop.example.test/complete' },
  });
  const noTokens = await createUser();
  await expectResponse('POST', '/orders', 400, {
    headers: apiKey(noTokens),
    body: { amount: 1, redirectUrl: 'https://shop.example.test/complete' },
  });
});

test('user transactions include only the authenticated merchant orders', async () => {
  const ownOrder = await createOrder();
  const otherOrder = await createOrder(admin);
  const token = await models.Token.findOne({ symbol: 'xlm' });
  const input = {
    submittedAt: Date.now(),
    method: 'single',
    payerAddress: Keypair.random().publicKey(),
    successful: true,
    amount: '10.2',
    token: token._id,
  };
  await models.Transaction.create([
    { ...input, hash: 'own-hash', order: ownOrder._id },
    { ...input, hash: 'other-hash', order: otherOrder._id },
  ]);
  const response = await expectResponse('GET', '/users/transactions', 200, {
    headers: bearer(merchant),
  });
  assert.equal(response.result.length, 1);
  assert.equal(response.result[0].hash, 'own-hash');
  assert.equal(response.result[0].order._id, String(ownOrder._id));
  assert.equal(response.result[0].token.symbol, 'xlm');
});

test('order quotes handle uppercase symbols and reject missing rates without leaving partial records', async () => {
  const token = await models.Token.findOne({ symbol: 'xlm' });
  token.symbol = 'XLM';
  await token.save();
  const body = { amount: 10000000, redirectUrl: 'https://shop.example.test/complete' };
  try {
    await expectResponse('POST', '/orders', 200, { headers: apiKey(merchant), body });
  } finally {
    token.symbol = 'xlm';
    await token.save();
  }
  for (const currency of ['[', 'lm']) {
    await expectResponse('POST', '/orders', 400, {
      headers: apiKey(merchant),
      body: { ...body, currency },
    });
  }
  const unsupported = await models.Token.create({
    symbol: 'no-rate',
    logo: 'https://example.test/no-rate.png',
    address: 'no-rate-address',
  });
  const userToken = await models.UserToken.create({ user: merchant._id, token: unsupported._id });
  const before = [await models.Order.countDocuments(), await models.OrderToken.countDocuments()];
  try {
    await expectResponse('POST', '/orders', 400, { headers: apiKey(merchant), body });
    assert.deepEqual(
      [await models.Order.countDocuments(), await models.OrderToken.countDocuments()],
      before,
    );
  } finally {
    await userToken.deleteOne();
    await unsupported.deleteOne();
  }
});

test('malformed and oversized JSON return JSON errors and keep the app responsive', async () => {
  const malformed = await expectResponse('POST', '/users/auth/login', 400, {
    raw: '{"password":"secret-body", invalid}',
  });
  assert.equal(malformed.error.message, 'Invalid request body');
  await expectResponse('POST', '/users/auth/login', 413, {
    body: { bluxToken: 'x'.repeat(110_000) },
  });
  await expectResponse('GET', '/health', 200);
  assert.ok(!JSON.stringify(records).includes('secret-body'));
});

test('database errors return 500 without hanging, losing route prefixes or leaking internals', async () => {
  const scenarios = [
    [models.Token, 'find', 'GET', '/tokens', {}],
    [models.UserToken, 'find', 'GET', '/users', { headers: bearer(merchant) }],
    [
      models.User,
      'findById',
      'PUT',
      '/users',
      { headers: bearer(merchant), body: { name: 'Failing store' } },
      1,
    ],
    [models.User, 'findByIdAndUpdate', 'PUT', '/users/api-key', { headers: bearer(merchant) }],
    [models.Order, 'find', 'GET', '/users/transactions', { headers: bearer(merchant) }],
    [
      models.User,
      'findById',
      'POST',
      '/users/auth/authenticator',
      { headers: bearer(merchant) },
      1,
    ],
    [
      models.User,
      'findById',
      'PUT',
      '/users/auth/authenticator',
      { headers: bearer(merchant), body: { token: '123456' } },
      1,
    ],
    [
      models.Token,
      'findOne',
      'POST',
      '/tokens',
      {
        headers: bearer(admin),
        body: { symbol: 'fail-token', logo: 'test-logo', address: 'test-address' },
      },
    ],
    [
      models.Token,
      'findOneAndUpdate',
      'PUT',
      '/tokens/xlm',
      { headers: bearer(admin), body: { logo: 'test-logo' } },
    ],
    [models.Token, 'findOneAndDelete', 'DELETE', '/tokens/xlm', { headers: bearer(admin) }],
    [models.User, 'findOne', 'POST', '/users/auth', { body: { bluxToken: 'valid-session' } }],
    [models.User, 'findOne', 'POST', '/users/auth/login', { body: { bluxToken: 'valid-session' } }],
    [models.User, 'findOne', 'POST', '/orders', { headers: apiKey(merchant), body: {} }],
    [models.User, 'findOne', 'POST', '/users/auth/reset', { body: { email: merchant.email } }],
    [models.User, 'findOne', 'POST', '/users/auth/verify', { body: { email: merchant.email } }],
    [models.User, 'findOne', 'GET', '/users/auth/reset/test-token', {}],
    [
      models.User,
      'findOne',
      'PUT',
      '/users/auth/reset',
      { body: { token: 'test-token', password: 'test-password' } },
    ],
    [models.User, 'findOne', 'PUT', '/users/auth/verify', { body: { token: 'test-token' } }],
    [
      models.User,
      'findOne',
      'PUT',
      '/users/subscription',
      { body: { token: 'test-token', isSubscribed: false } },
    ],
    [models.Order, 'findById', 'GET', `/orders/${new mongoose.Types.ObjectId()}`, {}],
    [
      models.Order,
      'findById',
      'PUT',
      `/orders/${new mongoose.Types.ObjectId()}`,
      { body: { email: 'payer@example.test' } },
    ],
    [models.Order, 'findById', 'DELETE', `/orders/${new mongoose.Types.ObjectId()}`, {}],
  ];
  for (const [model, method, httpMethod, path, options, allowedCalls = 0] of scenarios) {
    const original = model[method];
    let calls = 0;
    const replacement = mock.method(model, method, function (...args) {
      if (++calls <= allowedCalls) return original.apply(this, args);
      throw new Error('private-database-error');
    });
    try {
      const response = await expectResponse(httpMethod, path, 500, options);
      assert.equal(response.error.message, 'Internal server error');
      assert.ok(!JSON.stringify(response).includes('private-database-error'));
      assert.ok(records.at(-1).route.startsWith('/' + path.split('/')[1]));
    } finally {
      replacement.mock.restore();
    }
  }
  const replacement = mock.method(models.User, 'findOne', () =>
    Promise.reject(new Error('async-database-error')),
  );
  try {
    await expectResponse('POST', '/orders', 500, { headers: apiKey(merchant), body: {} });
  } finally {
    replacement.mock.restore();
  }
  await expectResponse('GET', '/health', 200);
});

test('production entry point starts, logs to console and file, serves HTTP and shuts down cleanly', async (t) => {
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const logPath = join(dir, 'startup.log');
  const child = spawn(
    process.execPath,
    ['--require', './tests/helpers/bootstrap.cjs', './dist/index.js'],
    {
      env: {
        ...process.env,
        ...env,
        PORT: String(port),
        DB_URI: mongo.uri,
        DB_NAME: 'wagent_startup_test',
        LOG_FILE_PATH: logPath,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  t.after(() => {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Startup timeout: ${stderr}`)), 10_000);
    const onData = () => {
      if (stdout.includes('APP: Started')) {
        clearTimeout(timeout);
        child.stdout.off('data', onData);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Startup exited (${code}): ${stderr}`));
    });
  });
  const response = await nativeFetch(`http://127.0.0.1:${port}/health`, {
    headers: { connection: 'close' },
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).db, 'connected');
  const exited = once(child, 'exit');
  child.kill('SIGTERM');
  const [code] = await exited;
  assert.equal(code, 0, stderr);
  const consoleRecords = stdout
    .split('\n')
    .filter((line) => line.startsWith('{'))
    .map(JSON.parse);
  const fileRecords = (await readFile(logPath, 'utf8')).trim().split('\n').map(JSON.parse);
  assert.deepEqual(consoleRecords, fileRecords);
  assert.ok(consoleRecords.some((r) => r.msg === 'DB: Connected'));
  assert.ok(consoleRecords.some((r) => r.msg.includes('APP: Started')));
  assert.ok(consoleRecords.some((r) => r.msg.includes('shutting down')));
  assert.ok(
    consoleRecords.some((r) => r.msg === 'HTTP: Request completed' && r.route === '/health'),
  );
});

test('request logs cover every registered endpoint, assign levels and redact secrets', async () => {
  const sensitive = 'secret-value-for-log-check';
  const before = records.filter((r) => r.msg === 'HTTP: Request completed').length;
  await expectResponse('GET', `/users/auth/reset/${sensitive}?password=${sensitive}`, 404, {
    headers: { authorization: `Bearer ${sensitive}`, apikey: sensitive },
  });
  const requestRecords = records.filter((r) => r.msg === 'HTTP: Request completed');
  assert.equal(requestRecords.length, before + 1, 'Exactly one completion log per request');
  const last = requestRecords.at(-1);
  assert.equal(last.route, '/users/auth/reset/:token');
  assert.equal(last.level, 40);
  assert.ok(!JSON.stringify(requestRecords).includes(sensitive));
  assert.ok(requestRecords.every((r) => r.durationMs >= 0 && /^[0-9a-f-]{36}$/.test(r.requestId)));
  assert.equal(new Set(requestRecords.map((r) => r.requestId)).size, requestRecords.length);
  assert.ok(requestRecords.some((r) => r.statusCode === 200 && r.level === 30));
  assert.ok(requestRecords.some((r) => r.statusCode === 500 && r.level === 50));

  const mounts = new Map([
    [require('../dist/routes').default, ''],
    [require('../dist/routes/users').default, '/users'],
    [require('../dist/routes/users/auth').default, '/auth'],
    [require('../dist/routes/orders').default, '/orders'],
    [require('../dist/routes/tokens').default, '/tokens'],
    [require('../dist/routes/swagger').default, '/swagger'],
  ]);
  const endpoints = new Set();
  const walk = (router, prefix = '') => {
    for (const layer of router.stack) {
      if (layer.route) {
        for (const method of Object.keys(layer.route.methods))
          endpoints.add(`${method.toUpperCase()} ${prefix}${layer.route.path}`);
      } else if (layer.handle.stack) {
        assert.ok(mounts.has(layer.handle), 'Add new router mounts to the coverage inventory');
        walk(layer.handle, prefix + mounts.get(layer.handle));
      }
    }
  };
  walk(app._router);
  endpoints.add('GET /swagger');
  const successful = new Set(
    requestRecords
      .filter((r) => r.statusCode >= 200 && r.statusCode < 300)
      .map((r) => `${r.method} ${r.route}`),
  );
  for (const endpoint of endpoints)
    assert.ok(successful.has(endpoint), `Missing successful route test: ${endpoint}`);
  assert.equal(endpoints.size, 24);
});
