import { RequestHandler } from 'express';

import User from '../models/User';

const apiKeyMiddleware: RequestHandler = async (req, res, next) => {
  const { apikey } = req.headers;

  if (!apikey) {
    return res.status(400).j({
      message: 'apikey field is required in the header',
    });
  }

  const user = await User.findOne({ apiKey: apikey });

  if (!user) {
    return res.status(400).j({
      message: 'apikey does not correspond to any active users',
    });
  }

  req.user = user;

  next();
};

export default apiKeyMiddleware;
