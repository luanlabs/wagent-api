import { RequestHandler } from 'express';
import { z } from 'zod';

import { validateEmail, validatePassword } from '../utils/validators';

const loginValidationMiddleware: RequestHandler = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.errors });
  }

  req.body = result.data;
  next();
};

export default loginValidationMiddleware;
