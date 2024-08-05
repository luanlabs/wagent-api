import { RequestHandler } from 'express';

import Order from '../../models/Order';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import ApiKey from '../../models/ApiKey';

const createNewOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  async (req, res) => {
    const { apiKey } = req.body;

    const userWithApiKey = await ApiKey.findOne({ key: apiKey, status: 'active' }).exec();

    if (!userWithApiKey) {
      return res.status(400).j({
        message: 'Invalid ApiKey',
      });
    }

    const newOrder = new Order({
      user: userWithApiKey.user,
      apiKey: userWithApiKey._id,
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
