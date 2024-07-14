import { RequestHandler } from 'express';

const adminAuthHandler: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({
      message: 'Authorization failed',
    });
  }

  next();
};

export default adminAuthHandler;
