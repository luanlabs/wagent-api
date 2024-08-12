import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../../models/Token';
import Order from '../../../models/Order';
import Transaction from '../../../models/Transaction';
import getTransactionDetails from '../../../utils/contract/getTransactionDetails';

const transactionSchema = z.object({
  hash: z.string({
    required_error: 'hash is required',
    invalid_type_error: 'hash must be a string',
  }),
});

const createTransactionHandler: RequestHandler = async (req, res) => {
  const result = transactionSchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  const { hash } = result.data;

  const { orderId, tokenAddress, method, submittedAt } = getTransactionDetails(hash);

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

  const newTransaction = new Transaction({
    hash,
    order: order._id,
    token: token._id,
    method,
    submittedAt,
  });

  await newTransaction.save();

  return res.status(200).j({ result: newTransaction });
};

export default createTransactionHandler;
