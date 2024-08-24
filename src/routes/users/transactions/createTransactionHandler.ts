import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import Token from '../../../models/Token';
import Order from '../../../models/Order';
import Transaction from '../../../models/Transaction';
import { validateEmail } from '../../../utils/validators';
import getTransactionDetails from '../../../utils/contract/getTransactionDetails';
import {
  sendPayerCompleteOrderEmail,
  sendUserCompleteOrderEmail,
} from '../../../utils/emailService';

const transactionSchema = z.object({
  hash: z.string({
    required_error: 'hash is required',
    invalid_type_error: 'hash must be a string',
  }),
  payerEmail: z.string().refine(validateEmail, 'Enter a valid email').optional(),
});

const createTransactionHandler: RequestHandler = async (req, res) => {
  const result = transactionSchema.safeParse(req.body);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  const { hash, payerEmail } = result.data;

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

  if (user?.settings?.isSubscribed) {
    sendUserCompleteOrderEmail(user.email, user.storeName, order.amount);
  }

  return res.status(200).j({ result: newTransaction });
};

export default createTransactionHandler;
