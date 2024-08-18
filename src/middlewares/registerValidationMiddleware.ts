import { RequestHandler } from 'express';
import { z } from 'zod';

import { validateEmail, validatePassword } from '../utils/validators';

const userSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  email: z.string().refine(validateEmail, 'Enter a valid email'),
  password: z.string().refine(validatePassword, 'Password must be at least 8 characters long'),
});

const registerValidationMiddleware: RequestHandler = (req, res, next) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.errors } );
  }

  req.body = result.data;
  next();
};

export default registerValidationMiddleware;