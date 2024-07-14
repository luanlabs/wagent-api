import { ErrorRequestHandler } from 'express';
import log from '../logger';

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  log.error({ message: err });

  return res.status(500).j({
    message: 'Something went wrong',
    result: { error: err },
  });
};

export default errorHandler;
