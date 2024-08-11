import { RequestHandler } from 'express';
import { z } from 'zod';

const getTransactionSchema = z.object({
  hash: z.string({
    required_error: 'hash is required',
    invalid_type_error: 'hash must be a string',
  }),
});

const getTransactionMiddleware: RequestHandler = (req, res, next) => {
  const result = getTransactionSchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default getTransactionMiddleware;
