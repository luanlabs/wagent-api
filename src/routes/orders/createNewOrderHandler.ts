import { RequestHandler } from 'express';

import Order from '../../models/Order';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import User from '../../models/User';

const createNewOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  async (req, res) => {
    const { apiKey, products } = req.body;

    const user = await User.findOne({ apiKey }).exec();

    if (!user) {
      return res.status(400).j({
        message: 'Invalid ApiKey',
      });
    }

    const newOrder = new Order({
      user: user._id,
      products,
    });

    await newOrder.save();

    return res.status(200).j({
      result: {
        id: newOrder._id,
      },
    });
  },
];

export default createNewOrderHandler;
