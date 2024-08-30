import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import Token from '../../../models/Token';
import Order from '../../../models/Order';
import Transaction from '../../../models/Transaction';
import getTransactionDetails from '../../../utils/contract/getTransactionDetails';
import {
  sendPayerCompleteOrderEmail,
  sendUserCompleteOrderEmail,
} from '../../../utils/emailService';
import validateRequestValueMiddleware from '../../../middlewares/validateRequestValueMiddleware';
import { createTransactionSchema } from '../../../schemas/transactionSchema';

const createTransactionHandler: RequestHandler[] = [
  validateRequestValueMiddleware(createTransactionSchema),
  async (req, res) => {
    const { hash, payerEmail } = req.body;

    const { orderId, tokenAddress, method, submittedAt, status } = getTransactionDetails(hash);

    const order = await Order.findOne({ _id: orderId });

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

    if (status) {
      await Order.findOneAndUpdate({ _id: orderId }, { status });
    }

    const newTransaction = new Transaction({
      hash,
      order: order._id,
      token: token._id,
      method,
      submittedAt,
      payerEmail,
    });

    await newTransaction.save();

    if (payerEmail) {
      sendPayerCompleteOrderEmail(payerEmail, order._id.toString());
    }

    const user = await User.findOne({ _id: order._id });

    if (user?.isSubscribed) {
      // sendUserCompleteOrderEmail(user.email, user.name, order.amount?.toString());
    }

    return res.status(200).json({ result: newTransaction });
  },
];

export default createTransactionHandler;
