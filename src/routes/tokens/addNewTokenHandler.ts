import { RequestHandler } from 'express';

import Token from '../../models/Token';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';
import adminAuthPasswordMiddleware from '../../middlewares/adminAuthPasswordMiddleware';

const addNewTokenHandler: RequestHandler[] = [
  adminAuthPasswordMiddleware,
  addTokenMiddleware,
  async (req, res) => {
    try {
      const { symbol, logo } = req.body;

      const lowCaseSymbol = symbol.toLowerCase();

      const newToken = new Token({
        symbol: lowCaseSymbol,
        logo,
      });

      await newToken.save();

      return res.status(201).j({
        result: newToken,
      });
    } catch (e) {
      if (e.code == 11000) {
        return res.status(400).j({
          message: 'Token already exists',
        });
      }
    }
  },
];

export default addNewTokenHandler;
