import { RequestHandler } from 'express';

import Order from '../../models/Order';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import User from '../../models/User';
import calculateProductsAmount from '../../utils/calculateProductsAmount';

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

    const amount = calculateProductsAmount(products);

    const newOrder = new Order({
      user: user._id,
      products,
      amount,
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
