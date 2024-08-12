import { RequestHandler } from 'express';
import { z } from 'zod';

import { validateEmail, validatePassword } from '../utils/validators';

const loginSchema = z.object({
  email: z.string().refine(validateEmail, 'Enter a valid email'),
  password: z.string().refine(validatePassword, 'Password must be at least 8 characters long'),
});

const loginValidationMiddleware: RequestHandler = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors: string[] = [];
    for (const issue of result.error.issues) {
      errors.push(issue.message);
    }
    return res.status(400).json({ errors });
  }

  req.body = result.data;
  next();
};

export default loginValidationMiddleware;
