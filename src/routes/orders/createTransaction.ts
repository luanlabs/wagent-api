import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import User from '../../models/User';
import Token from '../../models/Token';
import Order from '../../models/Order';
import Transaction from '../../models/Transaction';
import { emailValidation } from '../../utils/zodValidators';
import { sendPayerCompleteOrderEmail } from '../../utils/emailService';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import getTransactionDetails from '../../utils/contract/getTransactionDetails';

const createTransactionHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      hash: z.string({
        required_error: 'hash is required',
        invalid_type_error: 'hash must be a string',
      }),
      payerEmail: emailValidation.optional(),
    }),
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
    const { hash, payerEmail } = req.body;

    // todo: how to check if THIS order is paid?
    const { status, method, submittedAt, tokenAddress } = getTransactionDetails(hash);

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    const token = await Token.findOne({ address: tokenAddress });

    if (!token) {
      return res.status(404).j({
        message: 'Token not found',
      });
    }

    const transaction = await Transaction.findOne({ order: order._id });

    if (transaction) {
      return res.status(400).j({
        message: 'Transaction already exists',
      });
    }

    if (status === 'completed') {
      order.status = 'completed';

      await order.save();
    }

    const tx = new Transaction({
      hash,
      // todo: change method to number
      method,
      payerEmail,
      submittedAt,
      order: order._id,
      token: token._id,
    });

    await tx.save();

    if (payerEmail) {
      // todo: send full details
      sendPayerCompleteOrderEmail(payerEmail, order._id.toString());
    }

    const user = await User.findOne({ _id: order._id });

    if (user?.isSubscribed) {
      // todo: send full details
      // sendUserCompleteOrderEmail(user.email, user.name, order.amount?.toString());
    }

    return res.status(200).j({
      message: 'Transaction has been submitted',
      result: tx,
    });
  },
];

export default createTransactionHandler;
