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
    const errors: string[] = [];
    for (const issue of result.error.issues) {
      errors.push(issue.message);
    }
    return res.status(400).json({ errors });
  }

  next();
};

export default apiKeyMiddleware;
