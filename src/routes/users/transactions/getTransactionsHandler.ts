import { RequestHandler } from 'express';

import getTransactionMiddleware from '../../../middlewares/getTransactionMiddleware';
import Transaction from '../../../models/Transaction';

const getTransactionsHandler: RequestHandler[] = [
  getTransactionMiddleware,
  async (req, res) => {
    const { hash } = req.params;

    const transaction = await Transaction.findOne({ hash });

    if (!transaction) {
      return res.status(404).j({
        message: 'transaction not found',
      });
    }

    return res.status(200).j({ result: transaction });
  },
];

export default getTransactionsHandler;
