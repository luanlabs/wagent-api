import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

import User, { IUser } from '../models/User';
import getEnvs from '../config/getEnvs';

const findUserToken: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { JWT_SECRET } = getEnvs();

    if (!authorization) {
      return res.status(401).j({
        message: 'Authorization token is required',
      });
    }

    const token = authorization.match(/^Bearer\s+(.+)$/i);

    if (!token) {
      return res.status(400).j({
        message: 'Invalid token',
      });
    }

    const decodedToken = jwt.verify(token[1], JWT_SECRET);

    if (typeof decodedToken !== 'object' || !decodedToken || !('id' in decodedToken)) {
      return res.status(401).j({
        message: 'Invalid token payload',
      });
    }

    const user = await User.findById(decodedToken.id);

    req.user = user as IUser;

    next();
  } catch (error) {
    if (error.name && error.name === 'JsonWebTokenError') {
      return res.status(401).j({
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).j({
      message: error.message || 'An error occurred during token verification',
    });
  }
};

export default findUserToken;
