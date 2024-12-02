import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import Transaction from '../../models/Transaction';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const getTransactionByOrderId: RequestHandler[] = [
  validatorMiddleware({
    params: z.object({
      id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid invoiceId ObjectId',
      }),
    }),
  }),
  async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({ order: id })
      .populate('order')
      .populate('token')
      .exec();

    if (!transaction) {
      return res.status(404).j({
        message: 'Transaction not found',
      });
    }

    return res.j({
      message: 'transaction',
      result: transaction,
    });
  },
];

export default getTransactionByOrderId;
