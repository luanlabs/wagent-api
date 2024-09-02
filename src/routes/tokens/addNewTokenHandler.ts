import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../models/Token';
import validateRequestValueMiddleware from '../../middlewares/validateRequestValueMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';
import findUserToken from '../../middlewares/findUserToken';

const addTokenSchema = {
  body: z.object({
    symbol: z.string({
      required_error: 'symbol is required',
      invalid_type_error: 'symbol must be a string',
    }),
    logo: z.string({
      required_error: 'logo is required',
      invalid_type_error: 'logo must be a string',
    }),
  }),
};

const addNewTokenHandler: RequestHandler[] = [
  findUserToken,
  authMiddleware,
  validateRequestValueMiddleware(addTokenSchema),
  async (req, res) => {
    const { symbol, logo } = req.body;

    const tokenExists = await Token.findOne({ symbol, isActive: true });

    if (tokenExists) {
      return res.status(400).j({
        message: 'Token already exists',
      });
    }

    const lowCaseSymbol = symbol.toLowerCase();

    const newToken = new Token({
      symbol: lowCaseSymbol,
      logo,
    });

    await newToken.save();

    return res.status(201).j({
      message: 'TODO',
      result: newToken,
    });
  },
];

export default addNewTokenHandler;
