import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import envs from '../../config/envs';
import Order from '../../models/Order';
import { IUser } from '../../models/User';
import { uint } from '../../utils/zodValidators';
import getUserTokens from '../../utils/getUserTokens';
import { FIFTEEN_MINUTES } from '../../constants/dates';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const createOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  validatorMiddleware({
    body: z.object({
      products: z
        .array(
          z.object({
            count: uint('count'),
            amount: uint('amount'),
            logo: z.string().optional(),
            name: z.string({
              required_error: 'Product name is required',
              invalid_type_error: 'Product name must be a string',
            }),
          }),
        )
        .optional(),
      amount: uint('amount'),
      currency: z.string().optional(),
      redirectUrl: z
        .string({
          required_error: 'redirectUrl is required',
          invalid_type_error: 'redirectUrl must be a string',
        })
        .url({
          message: 'redirectUrl must be a valid URL',
        }),
    }),
  }),
  async (req, res) => {
    const { PAYMENT_URL } = envs();
    const { amount, products, currency, redirectUrl } = req.body;

    const user = req.user as IUser;

    const tokens = await getUserTokens(user._id as mongoose.Schema.Types.ObjectId);

    if (!tokens.length) {
      return res.status(400).j({
        message: 'No token has been added for the user',
      });
    }

    const orderObj = {
      amount,
      redirectUrl,
      user: user._id,
      status: 'pending',
      currency: currency || 'USD',
      expiredTimestamp: Date.now() + FIFTEEN_MINUTES,
    };

    if (products) {
      // @ts-ignore
      orderObj.products = products;
    }

    const order = new Order(orderObj);

    await order.save();

    return res.status(200).j({
      message: 'Order has been created',
      result: {
        id: order._id,
        url: `${PAYMENT_URL}/${order._id}`,
      },
    });
  },
];

export default createOrderHandler;
