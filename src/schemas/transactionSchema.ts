import { z } from 'zod';
import { validateEmail } from '../utils/validators';

export const createTransactionSchema = {
  body: z.object({
    hash: z.string({
      required_error: 'hash is required',
      invalid_type_error: 'hash must be a string',
    }),
    payerEmail: z.string().refine(validateEmail, 'Enter a valid email').optional(),
  }),
};

export const getTransactionSchema = {
  params: z.object({
    hash: z.string({
      required_error: 'hash is required',
      invalid_type_error: 'hash must be a string',
    }),
  }),
};
