import { RequestHandler } from 'express';

import { IUser } from '../../models/User';
import Transaction from '../../models/Transaction';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const getUserTransactionsHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const user = req.user as IUser;

    const transactions = await Transaction.find({ 'order.user._id': user._id });

    return res.j({
      message: 'User transactions',
      result: transactions,
    });
  },
];

export default getUserTransactionsHandler;
