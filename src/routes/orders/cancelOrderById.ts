import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import Order from '../../models/Order';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const cancelOrderByIdHandler: RequestHandler[] = [
  validatorMiddleware({
    params: z.object({
      id: z
        .string({
          required_error: 'id is required',
          invalid_type_error: 'id must be a string',
        })
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: 'id is invalid',
        }),
    }),
  }),
  async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    if (order.status === 'pending') {
      order.status = 'cancelled';

      await order.save();
    }

    return res.status(200).j({
      message: 'Order has been cancelled',
    });
  },
];

export default cancelOrderByIdHandler;
