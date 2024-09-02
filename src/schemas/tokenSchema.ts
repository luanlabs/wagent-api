import { z } from 'zod';

export const addTokenSchema = {
  body: z.object({
    symbol: z.string({
      required_error: 'symbol is required',
      invalid_type_error: 'symbol must be a string',
    }),
    logo: z.string({
      required_error: 'logo is required',
      invalid_type_error: 'logo must be a string',
    }),
  }),
};

export const deleteTokenSchema = {
  params: z.object({
    symbol: z.string({
      required_error: 'symbol is required',
      invalid_type_error: 'symbol must be a string',
    }),
  }),
};

export const editTokenSchema = {
  params: z.object({
    symbol: z.string({
      required_error: 'symbol is required',
      invalid_type_error: 'symbol must be a string',
    }),
  }),
  body: z.object({
    logo: z.string({
      required_error: 'logo is required',
      invalid_type_error: 'logo must be a string',
    }),
  }),
};
