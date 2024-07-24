import { RequestHandler } from 'express';
import { z } from 'zod';

const createOrderSchema = z.object({
  apiKey: z.string({
    required_error: 'apiKey is required',
    invalid_type_error: 'apiKey must be a string',
  }),
});

const apiKeyMiddleware: RequestHandler = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      message: err.message,
      path: err.path.join('.'),
    }));

    return res.status(400).j({ message: errors[0].message });
  }

  next();
};

export default apiKeyMiddleware;
