// Preload for the startup smoke test. No external services are contacted.
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');

nodemailer.createTransport = () => ({
  verify: (callback) => callback(null, true),
  sendMail: () => {
    throw new Error('Startup must not send emails');
  },
});

global.fetch = async (url) => {
  assert.equal(new URL(url).origin, 'https://api.coingecko.com');
  return Response.json({ usd: { xlm: 10, eur: 0.9 } });
};
