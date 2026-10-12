import 'dotenv/config';

import mongoose from 'mongoose';

import app from './app';
import db from './config/db';
import envs from './config/envs';
import log from './config/logger';
import saveCurrencies from './utils/saveCurrencies';
import checkExpiredTime from './utils/orders/checkExpiredTime';

const { DB_URI, DB_NAME, PORT } = envs();

// Safety net so a stray rejection is logged rather than silently lost.
process.on('unhandledRejection', (reason) => {
  log.error({ err: reason }, 'APP: Unhandled promise rejection');
});

const start = async () => {
  await db(DB_URI, DB_NAME);

  // Background jobs: keep currency rates fresh and expire stale orders.
  saveCurrencies();
  checkExpiredTime();

  const server = app.listen(PORT, () => {
    log.info(`APP: Started on :${PORT}`);
  });

  const shutdown = (signal: string) => {
    log.info(`APP: Received ${signal}, shutting down`);

    server.close(() => {
      mongoose.connection
        .close()
        .catch((e) => log.error(`APP: Error closing DB connection - ${e}`))
        .finally(() => process.exit(0));
    });

    // Force exit if graceful shutdown takes too long.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((err) => {
  log.fatal({ err }, 'APP: Failed to start');
  process.exitCode = 1;
});
