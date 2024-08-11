import { RequestHandler } from 'express';
import { z } from 'zod';

const generateApiKeySchema = z.object({
  id: z.string({
    required_error: 'id is required',
    invalid_type_error: 'id must be a string',
  }),
});

const generateApiKeyMiddleware: RequestHandler = (req, res, next) => {
  const result = generateApiKeySchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default generateApiKeyMiddleware;
