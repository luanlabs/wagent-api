import { ErrorRequestHandler } from 'express';

import log from '../config/logger';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  log.error(err);

  const isProduction = process.env.NODE_ENV === 'production';

  // Never leak the raw error object (stack traces, query internals, etc.) to
  // clients. Surface a generic message in production and the error message
  // only in non-production environments to aid local debugging.
  return res.status(500).j({
    message: 'Something went wrong',
    error: {
      message: isProduction
        ? 'Internal server error'
        : err instanceof Error
          ? err.message
          : 'Unknown error',
    },
  });
};

export default errorHandler;
