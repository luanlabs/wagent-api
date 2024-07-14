import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware: RequestHandler = (req, res, next) => {
  const authorization = req.header('Authorization') as string;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return res.status(401).j({ message: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decodedToken = jwt.verify(token, secret);
    const decoded = decodedToken as any;
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).j({ message: 'Token is not valid' });
  }
};
export default authMiddleware;
