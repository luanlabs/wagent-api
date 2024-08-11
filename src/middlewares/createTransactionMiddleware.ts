import { RequestHandler } from 'express';
import { z } from 'zod';

const createTransactionSchema = z.object({
  hash: z.string({
    required_error: 'hash is required',
    invalid_type_error: 'hash must be a string',
  }),
});

const createTransactionMiddleware: RequestHandler = (req, res, next) => {
  const result = createTransactionSchema.safeParse(req.body);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default createTransactionMiddleware;
