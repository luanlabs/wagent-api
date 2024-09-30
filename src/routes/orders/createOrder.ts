import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import envs from '../../config/envs';
import Order from '../../models/Order';
import { IUser } from '../../models/User';
import getUserTokens from '../../utils/getUserTokens';
import { float, uint } from '../../utils/zodValidators';
import { FIFTEEN_MINUTES } from '../../constants/dates';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import calculateProductsAmount from '../../utils/calculateProductsAmount';

const createOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  validatorMiddleware({
    body: z.object({
      products: z
        .array(
          z.object({
            count: uint('count'),
            amount: float('amount'),
            logo: z.string().optional(),
            name: z.string({
              required_error: 'Product name is required',
              invalid_type_error: 'Product name must be a string',
            }),
          }),
        )
        .optional(),
      amount: float('amount').optional(),
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
    const { amount, products, redirectUrl } = req.body;

    if (!amount && !products) {
      return res.status(400).j({
        message: 'Either amount or products is required',
      });
    }

    if (amount && products) {
      return res.status(400).j({
        message: 'Both amount and products are not allowed',
      });
    }

    const user = req.user as IUser;

    const tokens = await getUserTokens(user._id as mongoose.Schema.Types.ObjectId);

    if (!tokens.length) {
      return res.status(400).j({
        message: 'No token has been added for the user',
      });
    }

    const totalAmount: number = amount || calculateProductsAmount(products);

    const timestamp = user.minimumCancellableStreamDuration | FIFTEEN_MINUTES;

    const order = new Order({
      products,
      redirectUrl,
      user: user._id,
      status: 'pending',
      amount: totalAmount,
      expiredTimestamp: Date.now() + timestamp,
    });

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
