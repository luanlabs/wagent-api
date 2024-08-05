import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

const getOrderSchema = z.object({
  id: z
    .string({
      required_error: 'id is required',
      invalid_type_error: 'id must be a string',
    })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: 'id must be a valid ObjectId',
    }),
});

const getOrderMiddleware: RequestHandler = (req, res, next) => {
  const result = getOrderSchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  next();
};

export default getOrderMiddleware;
