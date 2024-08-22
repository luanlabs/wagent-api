import { z } from 'zod';
import { RequestHandler } from 'express';

import Transaction from '../../../models/Transaction';

const transactionSchema = z.object({
  hash: z.string({
    required_error: 'hash is required',
    invalid_type_error: 'hash must be a string',
  }),
});

const getTransactionsHandler: RequestHandler = async (req, res) => {
  const result = transactionSchema.safeParse(req.params);

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  const { hash } = result.data;

  const transaction = await Transaction.findOne({ hash: new RegExp(`^${hash}$`, 'i') });

  if (!transaction) {
    return res.status(404).j({
      message: 'transaction not found',
    });
  }

  return res.status(200).j({ result: transaction });
};

export default getTransactionsHandler;
