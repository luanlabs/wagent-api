import { RequestHandler } from 'express';

import User from '../../models/User';
import Order from '../../models/Order';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import calculateProductsAmount from '../../utils/calculateProductsAmount';

const createNewOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  async (req, res) => {
    const { apiKey, products, amount, redirectUrl } = req.body;

    const user = await User.findOne({ apiKey }).exec();

    if (!user) {
      return res.status(400).j({
        message: 'Invalid ApiKey',
      });
    }

    let newAmount = '';

    if (!amount) {
      newAmount = calculateProductsAmount(products);
    }

    const newOrder = new Order({
      user: user._id,
      status: 'pending',
      products,
      amount: newAmount,
      redirectUrl,
    });

    await newOrder.save();

    return res.status(200).j({
      message: 'TODO',
      result: {
        id: newOrder._id,
      },
    });
  },
];

export default createNewOrderHandler;
