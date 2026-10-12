import { ErrorRequestHandler } from 'express';

import log from '../config/logger';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const status = err.status === 400 || err.status === 413 ? err.status : 500;
  const message =
    status === 400
      ? 'Invalid request body'
      : status === 413
        ? 'Request body too large'
        : 'Something went wrong';

  if (status === 500) {
    log.error(err);
  } else {
    // Parser errors can include the submitted body in their message/stack.
    log.warn({ statusCode: status }, message);
  }

  // Never leak the raw error object (stack traces, query internals, etc.) to
  // clients. Surface a generic message in production and the error message
  // only in non-production environments to aid local debugging.
  return res.status(status).j({
    message,
    error: {
      message:
        status !== 500
          ? message
          : isProduction
            ? 'Internal server error'
            : err instanceof Error
              ? err.message
              : 'Unknown error',
    },
  });
};

export default errorHandler;
