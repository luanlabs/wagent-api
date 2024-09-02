import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import Order from '../../models/Order';
import validateRequestValueMiddleware from '../../middlewares/validateRequestValueMiddleware';

const getOrderSchema = {
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

const getOrderByIdHandler: RequestHandler[] = [
  validateRequestValueMiddleware(getOrderSchema),
  async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id })
      .populate([
        {
          path: 'user',
          select: 'email apiKey storeName storeImage isVerified',
        },
      ])
      .select('-__v')
      .lean();

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    return res.status(200).j({
      message: '',
      result: order,
    });
  },
];

export default getOrderByIdHandler;
