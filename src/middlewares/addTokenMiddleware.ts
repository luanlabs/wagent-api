import { RequestHandler } from 'express';
import { z } from 'zod';

const addTokenSchema = z.object({
  symbol: z.string({
    required_error: 'symbol is required',
    invalid_type_error: 'symbol must be a string',
  }),
  logo: z.string({
    required_error: 'logo is required',
    invalid_type_error: 'logo must be a string',
  }),
});

const addTokenMiddleware: RequestHandler = (req, res, next) => {
  const result = addTokenSchema.safeParse(req.body);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default addTokenMiddleware;
