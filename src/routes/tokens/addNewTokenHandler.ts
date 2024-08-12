import { RequestHandler } from 'express';

import Token from '../../models/Token';
import addTokenMiddleware from '../../middlewares/addTokenMiddleware';
import adminAuthMIddleware from '../../middlewares/adminAuthMIddleware';
import getTokenDetails from '../../utils/contracts/getTokenDetails';

const addNewTokenHandler: RequestHandler[] = [
  adminAuthMIddleware,
  addTokenMiddleware,
  async (req, res) => {
    const { address, logo } = req.body;

    const existsToken = await Token.findOne({ address, isActive: true });

    if (existsToken) {
      return res.status(400).j({
        message: 'Token already exists',
      });
    }

    const { symbol } = await getTokenDetails(address);

    const lowCaseSymbol = symbol.toLowerCase();

    const newToken = new Token({
      address,
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
