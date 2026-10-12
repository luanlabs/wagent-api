import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';

import routes from './routes';
import errorHandler from './routes/error';
import requestLogger from './middlewares/requestLogger';
import customResponseHandler from './middlewares/customResponseHandler';

const app = express();

// Allow all origins by default. CORS_ORIGIN accepts a comma-separated allowlist.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(requestLogger);
app.use(customResponseHandler);
app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

app.use(routes);
// Parser errors occur before the router and need the same JSON error response.
app.use(errorHandler);

export default app;
