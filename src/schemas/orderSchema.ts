import { z } from 'zod';
import mongoose from 'mongoose';

export const getOrderSchema = {
  params: z.object({
    id: z
      .string({
        required_error: 'id is required',
        invalid_type_error: 'id must be a string',
      })
      .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: 'id must be a valid ObjectId',
      }),
  }),
};
