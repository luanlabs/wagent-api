import { RequestHandler } from 'express';

import log from '../../../config/logger';
import Token from '../../../models/Token';
import Order from '../../../models/Order';
import Transaction from '../../../models/Transaction';
import getTransactionDetails from '../../../utils/contract/getTransactionDetails';
import createTransactionMiddleware from '../../../middlewares/createTransactionMiddleware';

const createTransactionHandler: RequestHandler[] = [
  createTransactionMiddleware,
  async (req, res) => {
    const { hash } = req.body;

    const { id, address, method, submittedAt } = getTransactionDetails(hash);

    const order = await Order.findOne({ _id: id });

    if (!order) {
      log.error('Order not found');

      return res.status(404).j({
        message: 'Order not found',
      });
    }

    const token = await Token.findOne({ address });

    if (!token) {
      log.error('Token not found');

      return res.status(404).j({
        message: 'Token not found',
      });
    }

    const transaction = await Transaction.findOne({ order: order._id });

    if (transaction) {
      return res.status(400).j({
        message: 'Transaction exist',
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
  },
];

export default createTransactionHandler;
