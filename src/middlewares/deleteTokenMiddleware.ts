import { RequestHandler } from 'express';
import { z } from 'zod';

const deleteTokenSchema = z.object({
  symbol: z.string({
    required_error: 'symbol is required',
    invalid_type_error: 'symbol must be a string',
  }),
});

const deleteTokenMiddleware: RequestHandler = (req, res, next) => {
  const result = deleteTokenSchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default deleteTokenMiddleware;
