import { RequestHandler } from 'express';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';
import Tokens from '../../models/Tokens';

const addNewTokenHandler: RequestHandler[] = [
  addTokenMiddleware,
  async (req, res) => {
    const { symbol, logo } = req.body;

    const token = await Tokens.findOne({ symbol });

    if (token) {
      return res.status(400).j({
        message: 'The token is available',
      });
    }

    const newToken = new Tokens({
      symbol,
      logo,
    });

    await newToken.save();

    return res.status(201).j({
      message: 'The token was saved successfully',
    });
  },
];

export default addNewTokenHandler;
