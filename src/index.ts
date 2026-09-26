import 'dotenv/config';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';

import db from './config/db';
import routes from './routes';
import envs from './config/envs';
import log from './config/logger';
import saveCurrencies from './utils/saveCurrencies';
import checkExpiredTime from './utils/orders/checkExpiredTime';
import customResponseHandler from './middlewares/customResponseHandler';

const app = express();

const { DB_URI, DB_NAME, PORT } = envs();

// Allow all origins by default (preserving existing behaviour). Restrict access
// by setting CORS_ORIGIN to a comma-separated list of allowed origins.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lightweight liveness endpoint for container/orchestrator health checks.
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

app.use(customResponseHandler);
app.use(routes);

// Safety net so a stray rejection is logged rather than silently lost.
process.on('unhandledRejection', (reason) => {
  log.error(`APP: Unhandled promise rejection - ${reason}`);
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

start();
