import { z } from 'zod';

import { validateEmail, validatePassword } from './validators';

export const emailValidation = z.string().refine(validateEmail, 'Enter a valid email');
export const passwordValidation = z
  .string()
  .refine(validatePassword, 'Password must be at least 8 characters long');

export const uint = (title: string) =>
  z.coerce
    .number({ message: `${title} must be a number` })
    .int()
    .nonnegative('Number must be greater than or equal to 0');

export const float = (title: string) =>
  z.coerce
    .number({ message: `${title} must be a number` })
    .nonnegative('Number must be greater than or equal to 0');
