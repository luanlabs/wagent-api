import { RequestHandler } from 'express';

import { IUser } from '../../models/User';
import Transaction from '../../models/Transaction';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';
import Order from '../../models/Order';

const getUserTransactionsHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const user = req.user as IUser;

    const userOrderIds = await Order.find({ user: user._id }).distinct('_id');
    const transactions = await Transaction.find({ order: { $in: userOrderIds } })
      .populate('order')
      .populate('token')
      .exec();

    return res.j({
      message: 'User transactions',
      result: transactions,
    });
  },
];

export default getUserTransactionsHandler;
