import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import getEnvs from '../config/getEnvs';

const authMiddleware: RequestHandler = (req, res, next) => {
  const authorization = req.header('Authorization') as string;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return res.status(401).j({ message: 'No token, authorization denied' });
  }

  const { JWT_SECRET } = getEnvs();

  try {
    const secret = JWT_SECRET;

    const decodedToken = jwt.verify(token, secret);

    if (typeof decodedToken != 'string') {
      req.user = decodedToken.id;
      next();
    }
  } catch (err) {
    res.status(401).j({ message: 'Token is not valid' });
  }
};
export default authMiddleware;
