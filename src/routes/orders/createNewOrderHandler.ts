import { RequestHandler } from 'express';

import User from '../../models/User';
import Order from '../../models/Order';
import createOrderValidationMiddleware from '../../middlewares/createOrderValidationMiddleware';

const createNewOrderHandler: RequestHandler[] = [
  createOrderValidationMiddleware,
  async (req, res) => {
    const { api_key } = req.body;

    // TODO: find user with api_key
    const user = await User.find();

    const newOrder = new Order({
      user: user[0]._id,
      api_key,
    });

    await newOrder.save();

    return res.status(200).j({
      result: {
        id: newOrder.id,
      },
    });
  },
];

export default createNewOrderHandler;
