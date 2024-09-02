import { z } from 'zod';
import { RequestHandler } from 'express';

import Transaction from '../../../models/Transaction';
import validateRequestValueMiddleware from '../../../middlewares/validateRequestValueMiddleware';

const getTransactionSchema = {
  params: z.object({
    hash: z.string({
      required_error: 'hash is required',
      invalid_type_error: 'hash must be a string',
    }),
  }),
};

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
