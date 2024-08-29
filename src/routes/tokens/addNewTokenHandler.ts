import { RequestHandler } from 'express';

import Token from '../../models/Token';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';
import adminAuthMIddleware from '../../middlewares/adminAuthMIddleware';

const addNewTokenHandler: RequestHandler[] = [
  adminAuthMIddleware,
  addTokenMiddleware,
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
