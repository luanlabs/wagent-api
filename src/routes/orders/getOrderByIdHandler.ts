import { RequestHandler } from 'express';

import Order from '../../models/Order';
import getOrderMiddleware from '../../middlewares/getOrderMiddleware';

const getOrderByIdHandler: RequestHandler[] = [
  getOrderMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id })
      .populate([
        {
          path: 'user',
          select: 'email apiKey storeName storeImage isVerified',
        },
      ])
      .select('-__v')
      .lean();

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    return res.status(200).j({
      message: '',
      result: order,
    });
  },
];

export default getOrderByIdHandler;
