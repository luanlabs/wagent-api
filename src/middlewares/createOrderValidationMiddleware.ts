import { RequestHandler } from 'express';
import { z } from 'zod';

const createOrderSchema = z.object({
  api_key: z.string({
    required_error: 'api_key is required',
    invalid_type_error: 'api_key must be a string',
  }),
});

const createOrderValidationMiddleware: RequestHandler = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      message: err.message,
      path: err.path.join('.'),
    }));

    return res.status(400).j({ message: errors[0].message });
  }

  req.body = result.data;
  next();
};

export default createOrderValidationMiddleware;
