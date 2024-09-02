import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../models/Token';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const createTokenHandler: RequestHandler[] = [
  authorizationMiddleware,
  adminMiddleware,
  validatorMiddleware({
    body: z.object({
      logo: z.string({
        required_error: 'logo is required',
        invalid_type_error: 'logo must be a string',
      }),
      symbol: z.string({
        required_error: 'symbol is required',
        invalid_type_error: 'symbol must be a string',
      }),
      address: z.string({
        required_error: 'address is required',
        invalid_type_error: 'address must be a string',
      }),
    }),
  }),
  async (req, res) => {
    const { logo, symbol, address } = req.body;

    const token = await Token.findOne({ symbol: { $regex: new RegExp(symbol, 'i') } });

    if (token) {
      return res.status(400).j({
        message: 'Token already exists',
      });
    }

    const newToken = new Token({
      logo,
      symbol,
      address,
    });

    await newToken.save();

    return res.status(201).j({
      message: 'Token has been created',
      result: newToken,
    });
  },
];

export default createTokenHandler;
