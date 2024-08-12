import { RequestHandler } from 'express';
import { z } from 'zod';

const addTokenSchema = z.object({
  address: z.string({
    required_error: 'address is required',
    invalid_type_error: 'address must be a string',
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
