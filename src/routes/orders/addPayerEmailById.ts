import { z } from 'zod';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import Order from '../../models/Order';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { emailValidation } from '../../utils/zodValidators';

const addPayerEmailByIdHandler: RequestHandler[] = [
  validatorMiddleware({
    params: z.object({
      id: z
        .string({
          required_error: 'id is required',
          invalid_type_error: 'id must be a string',
        })
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: 'id is invalid',
        }),
    }),
    body: z.object({
      email: emailValidation,
    }),
  }),
  async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).j({
        message: 'Order not found',
      });
    }

    if (order.status === 'pending') {
      order.payerEmail = email;
      await order.save();
    }

    return res.status(200).j({
      message: 'Payer email has been added',
    });
  },
];

export default addPayerEmailByIdHandler;
