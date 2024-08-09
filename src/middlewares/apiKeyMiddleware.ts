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
    const firstError = result.error.issues[0].message;
    return res.status(400).json({ message: firstError });
  }

  next();
};

export default apiKeyMiddleware;
