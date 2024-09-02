import { RequestHandler } from 'express';

import User from '../models/User';

const apiKeyMiddleware: RequestHandler = async (req, res, next) => {
  const { apiKey } = req.headers;

  if (!apiKey) {
    return res.status(400).j({
      message: 'apiKey field is required in the header',
    });
  }

  const user = await User.findOne({ apiKey });

  if (!user) {
    return res.status(400).j({
      message: 'apiKey does not correspond to any active users',
    });
  }

  req.user = user;

  next();
};

export default apiKeyMiddleware;
