import { z } from 'zod';

import { validateEmail, validatePassword } from './validators';

// TODO: fix the tokenValidation (use required instead of min, and a custom error message)
export const tokenValidation = z.string().min(5);
export const emailValidation = z.string().refine(validateEmail, 'Enter a valid email');
export const passwordValidation = z
  .string()
  .refine(validatePassword, 'Password must be at least 8 characters long');
