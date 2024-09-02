import { ErrorRequestHandler } from 'express';

import log from '../config/logger';

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  log.error(err);

  return res.status(500).j({
    message: 'Something went wrong',
    error: {
      message: err.message,
      extras: err,
    },
  });
};

export default errorHandler;
