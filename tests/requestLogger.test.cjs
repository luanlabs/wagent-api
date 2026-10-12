const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { test, mock } = require('node:test');

Object.assign(process.env, require('./helpers/env.cjs'), { NODE_ENV: 'development' });
const log = require('../dist/config/logger').default;
const requestLogger = require('../dist/middlewares/requestLogger').default;

test('aborted requests log once at warning level without credentials or raw URLs', () => {
  const warn = mock.method(log, 'warn', () => {});
  const res = Object.assign(new EventEmitter(), {
    locals: {},
    statusCode: 200,
    writableFinished: false,
  });
  let nextCalls = 0;
  requestLogger(
    { method: 'POST', baseUrl: '', originalUrl: '/secret?apikey=secret' },
    res,
    () => nextCalls++,
  );
  res.emit('close');
  res.emit('finish');
  assert.equal(nextCalls, 1);
  assert.equal(warn.mock.callCount(), 1);
  const [record, message] = warn.mock.calls[0].arguments;
  assert.equal(record.aborted, true);
  assert.equal(record.route, 'unmatched');
  assert.ok(record.durationMs >= 0);
  assert.ok(!JSON.stringify(record).includes('secret'));
  assert.equal(message, 'HTTP: Request completed');
  warn.mock.restore();
});
