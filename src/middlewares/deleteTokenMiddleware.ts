import { RequestHandler } from 'express';
import { z } from 'zod';

const deleteTokenSchema = z.object({
  address: z.string({
    required_error: 'address is required',
    invalid_type_error: 'address must be a string',
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
