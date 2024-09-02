import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../models/Token';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const editTokenHandler: RequestHandler[] = [
  authorizationMiddleware,
  adminMiddleware,
  validatorMiddleware({
    params: z.object({
      symbol: z.string({
        required_error: 'symbol is required',
        invalid_type_error: 'symbol must be a string',
      }),
    }),
    body: z.object({
      logo: z.string({
        required_error: 'logo is required',
        invalid_type_error: 'logo must be a string',
      }),
    }),
  }),
  async (req, res) => {
    const { logo } = req.body;
    const { symbol } = req.params;

    const token = await Token.findOneAndUpdate({ symbol: new RegExp(symbol, 'i') }, { logo });

    if (!token) {
      return res.status(400).j({
        message: 'Token not exists',
      });
    }

    return res.status(200).j({
      message: 'Token has been changed',
      result: token,
    });
  },
];

export default editTokenHandler;
