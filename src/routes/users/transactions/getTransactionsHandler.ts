import { RequestHandler } from 'express';

import Transaction from '../../../models/Transaction';
import validateRequestValueMiddleware from '../../../middlewares/validateRequestValueMiddleware';
import { getTransactionSchema } from '../../../schemas/transactionSchema';

const getTransactionsHandler: RequestHandler[] = [
  validateRequestValueMiddleware(getTransactionSchema),
  async (req, res) => {
    const { hash } = req.params;

    const transaction = await Transaction.findOne({ hash: new RegExp(`^${hash}$`, 'i') });

    if (!transaction) {
      return res.status(404).json({
        message: 'transaction not found',
      });
    }

    return res.status(200).json({ result: transaction });
  },
];

export default getTransactionsHandler;
