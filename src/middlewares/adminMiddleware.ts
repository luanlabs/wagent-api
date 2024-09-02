import { RequestHandler } from 'express';

import { IUser } from '../models/User';

const adminMiddleware: RequestHandler = (req, res, next) => {
  const user = req.user as IUser;

  if (!user.isAdmin) {
    return res.status(401).j({
      message: 'This action requires admin authorization',
    });
  }

  next();
};

export default adminMiddleware;
