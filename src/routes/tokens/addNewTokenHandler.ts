import { RequestHandler } from 'express';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';
import Tokens from '../../models/Tokens';

const addNewTokenHandler: RequestHandler[] = [
  addTokenMiddleware,
  async (req, res) => {
    const { symbol, logo } = req.body;

    const lowCaseSymbol = symbol.toLowerCase();

    const token = await Tokens.findOne({ symbol: lowCaseSymbol });

    if (token) {
      return res.status(400).j({
        message: 'Token already exists',
      });
    }

    const newToken = new Tokens({
      symbol: lowCaseSymbol,
      logo,
    });

    await newToken.save();

    return res.status(201).j({
      result: newToken,
    });
  },
];

export default addNewTokenHandler;
