import { RequestHandler } from 'express';

const authMiddleware: RequestHandler = (req, res, next) => {
  const user = req.user;

  if (!user || typeof user == 'string') {
    return res.status(400).j({
      message: 'User not found',
    });
  }

  if (!user.isAdmin) {
    return res.status(403).j({
      message: 'Admin verification failed',
    });
  }

  next();
};
export default authMiddleware;
