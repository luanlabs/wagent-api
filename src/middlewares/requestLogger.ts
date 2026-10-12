import { randomUUID } from 'node:crypto';
import { RequestHandler } from 'express';

import log from '../config/logger';

const requestLogger: RequestHandler = (req, res, next) => {
  const requestId = randomUUID();
  const startedAt = process.hrtime.bigint();

  const onComplete = () => {
    res.off('finish', onComplete);
    res.off('close', onComplete);

    const aborted = !res.writableFinished;
    const level =
      res.statusCode >= 500 ? 'error' : aborted || res.statusCode >= 400 ? 'warn' : 'info';

    log[level](
      {
        requestId,
        method: req.method,
        // Log route templates, never bodies, credentials, queries or token-bearing URLs.
        route:
          res.locals.requestRoute ||
          (req.route ? `${req.baseUrl}${req.route.path}` : req.baseUrl || 'unmatched'),
        statusCode: res.statusCode,
        durationMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000,
        aborted,
      },
      'HTTP: Request completed',
    );
  };

  res.once('finish', onComplete);
  res.once('close', onComplete);
  next();
};

export default requestLogger;
