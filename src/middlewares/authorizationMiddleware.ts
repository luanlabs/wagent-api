import { RequestHandler } from 'express';

import User from '../models/User';
import { verify } from '../utils/jwt';

const authorizationMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);

    if (!authorization) {
      console.log(1);
      return res.status(401).j({
        message: 'Authorization token is required',
      });
    }

    const isValid = authorization.match(/^Bearer\s+(.+)$/i);

    if (!isValid) {
      return res.status(401).j({
        message: 'Authorization token is required',
      });
    }

    const token = authorization.replace('Bearer ', '');
    const id = verify(token);

    if (!id) {
      return res.status(401).j({
        message: 'Authorization token is invalid or expired',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).j({
        message: 'Authorization token is invalid or expired',
      });
    }

    req.user = user;

    next();
  } catch (e) {
    return res.status(401).j({
      message: 'Authorization has failed',
    });
  }
};

export default authorizationMiddleware;
