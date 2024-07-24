import { RequestHandler } from 'express';

import User from '../../models/User';
import Order from '../../models/Order';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';

const createNewOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  async (req, res) => {
    const { apiKey } = req.body;

    // TODO: find user with api_key
    const user = await User.find();

    const newOrder = new Order({
      user: user[0]._id,
      apiKey,
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
