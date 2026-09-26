import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import Order from '../../models/Order';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import Transaction from '../../models/Transaction';
import OrderToken from '../../models/OrderToken';

const getOrderByIdHandler: RequestHandler[] = [
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

    const order = await Order.findById(id)
      .populate([
        {
          path: 'user',
          select: 'name logo methods',
        },
      ])
      .select('-__v')
      .exec();

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    const transaction = await Transaction.findOne({ order: order._id }).populate('token').exec();

    if (order.expiredTimestamp < Date.now() && order.status === 'pending') {
      order.status = 'expired';

      await order.save();
    }

    const orderTokens = await OrderToken.find({ order: order._id.toString() }).populate('token');

    const response = {
      ...order.toObject(),
      transaction,
      tokens: orderTokens,
    };

    return res.status(200).j({
      message: 'Order',
      result: response,
    });
  },
];

export default getOrderByIdHandler;
