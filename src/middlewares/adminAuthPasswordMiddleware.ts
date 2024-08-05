import { RequestHandler } from 'express';
import getEnvs from '../config/getEnvs';

const adminAuthPasswordMiddleware: RequestHandler = (req, res, next) => {
  const { ADMIN_PASSWORD } = getEnvs();
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'Authorization failed',
      result: {},
    });
  } else if (authorization === ADMIN_PASSWORD) {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Authorization failed',
      result: {},
    });
  }
};

export default adminAuthPasswordMiddleware;
