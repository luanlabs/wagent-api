import { RequestHandler } from 'express';
import { z } from 'zod';

const createOrderSchema = z
  .object({
    apiKey: z.string({
      required_error: 'apiKey is required',
      invalid_type_error: 'apiKey must be a string',
    }),
    products: z
      .array(
        z.object({
          name: z.string({
            required_error: 'Product name is required',
            invalid_type_error: 'Product name must be a string',
          }),
          logo: z.string({
            required_error: 'Product logo is required',
            invalid_type_error: 'Product logo must be a string',
          }),
          amount: z.string({
            required_error: 'Product amount is required',
            invalid_type_error: 'Product amount must be a string',
          }),
        }),
      )
      .nonempty({
        message: 'Products array must contain at least one product',
      })
      .optional(),
    amount: z
      .string({
        invalid_type_error: 'amount must be a string',
      })
      .optional(),
    redirectUrl: z
      .string({
        required_error: 'redirectUrl is required',
        invalid_type_error: 'redirectUrl must be a string',
      })
      .url({
        message: 'redirectUrl must be a valid URL',
      }),
  })
  .refine((data) => data.products || data.amount, {
    message: 'Either products or amount must be provided',
    path: ['products', 'amount'],
  });

const apiKeyMiddleware: RequestHandler = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.errors });
  }

  next();
};

export default apiKeyMiddleware;
