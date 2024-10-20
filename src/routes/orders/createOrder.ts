import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import envs from '../../config/envs';
import { IUser } from '../../models/User';
import { uint } from '../../utils/zodValidators';
import Order, { IOrder } from '../../models/Order';
import getUserTokens from '../../utils/getUserTokens';
import { FIFTEEN_MINUTES } from '../../constants/dates';
import apiKeyMiddleware from '../../middlewares/apiKeyMiddleware';
import checkCurrencyExists from '../../utils/checkCurrencyExists';
import convertCurrencyToUsd from '../../utils/convertCurrencyToUsd';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const createOrderHandler: RequestHandler[] = [
  apiKeyMiddleware,
  validatorMiddleware({
    body: z.object({
      products: z
        .array(
          z.object({
            count: uint('count'),
            amount: z.string(),
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

    const selectedCurrency = currency || 'USD';

    const existingCurrency = await checkCurrencyExists(selectedCurrency);

    if (!existingCurrency) {
      return res.status(400).j({
        message: 'Failed to create order',
        error: {
          message: 'Currency does not exist',
          extras: selectedCurrency,
        },
      });
    }

    const number = convertCurrencyToUsd(amount, existingCurrency.rate);

    const user = req.user as IUser;

    const tokens = await getUserTokens(user._id as mongoose.Schema.Types.ObjectId);

    if (!tokens.length) {
      return res.status(400).j({
        message: 'No token has been added for the user',
      });
    }

    const orderObj: IOrder = {
      initialAmount: amount,
      amount: number,
      redirectUrl, // @ts-ignore
      user: user._id,
      status: 'pending',
      currency: selectedCurrency,
      expiredTimestamp: Date.now() + FIFTEEN_MINUTES,
    };

    if (products) {
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
