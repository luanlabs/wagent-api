import { RequestHandler } from 'express';
import { z } from 'zod';

const createOrderSchema = z.object({
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
    }),
  callback: z
    .string({
      required_error: 'callback is required',
      invalid_type_error: 'callback must be a string',
    })
    .url({
      message: 'callback must be a valid URL',
    }),
  link2: z
    .string({
      required_error: 'link2 is required',
      invalid_type_error: 'link2 must be a string',
    })
    .url({
      message: 'link2 must be a valid URL',
    }),
});

const apiKeyMiddleware: RequestHandler = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.errors });
  }

  next();
};

export default apiKeyMiddleware;
