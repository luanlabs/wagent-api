import { RequestHandler } from 'express';

import Tokens from '../../models/Tokens';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';

const addNewTokenHandler: RequestHandler[] = [
  addTokenMiddleware,
  async (req, res) => {
    try {
      const { symbol, logo } = req.body;

      const lowCaseSymbol = symbol.toLowerCase();

      const newToken = new Tokens({
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
