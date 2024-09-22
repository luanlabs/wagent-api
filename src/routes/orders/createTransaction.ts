import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import User from '../../models/User';
import Token from '../../models/Token';
import Order from '../../models/Order';
import Transaction from '../../models/Transaction';
import { emailValidation } from '../../utils/zodValidators';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import getTransactionDetails from '../../utils/contract/getTransactionDetails';
import { sendPayerCompleteOrderEmail, sendUserCompleteOrderEmail } from '../../utils/emailService';
import sendNotification from '../../utils/sendNotification';

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
    const { status, method, submittedAt, tokenAddress, payerAddress } =
      await getTransactionDetails(hash);

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    if (order.status == 'cancelled') {
      return res.status(404).j({
        message: 'The order has been cancelled',
      });
    }

    const token = await Token.findOne({ address: { $regex: new RegExp(tokenAddress, 'i') } });

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

    let tx;

    try {
      tx = new Transaction({
        hash,
        method,
        payerEmail,
        submittedAt,
        payerAddress,
        order: order._id,
        token: token._id,
      });

      await tx.save();
    } catch (e) {
      return res.status(502).j({
        message: 'Something went wrong!',
        error: {
          message: e.message,
        },
      });
    }

    if (status === 'completed') {
      order.status = 'completed';

      await order.save();

      const shopOwner = await User.findById(order.user);

      if (shopOwner && shopOwner.notificationTokens.length > 0) {
        await sendNotification(shopOwner.notificationTokens, order.amount);
      }
    }

    if (payerEmail) {
      // todo: send full details
      sendPayerCompleteOrderEmail(payerEmail, order._id.toString());
    }

    const user = await User.findOne({ _id: order._id });

    if (user?.isSubscribed) {
      // todo: send full details
      sendUserCompleteOrderEmail(user.email, user.name, order.amount?.toString());
    }

    return res.status(200).j({
      message: 'Transaction has been submitted',
      result: tx,
    });
  },
];

export default createTransactionHandler;
