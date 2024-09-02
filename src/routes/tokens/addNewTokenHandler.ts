import { RequestHandler } from 'express';

import Token from '../../models/Token';
import validateRequestValueMiddleware from '../../middlewares/validateRequestValueMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';
import findUserToken from '../../middlewares/findUserToken';
import { addTokenSchema } from '../../schemas/tokenSchema';

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
