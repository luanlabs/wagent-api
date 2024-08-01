import { RequestHandler } from 'express';

import Tokens from '../../models/Tokens';
import deleteTokenMiddleware from '../../middlewares/deleteTokenMiddleware';

const deleteTokenHandler: RequestHandler[] = [
  deleteTokenMiddleware,
  async (req, res) => {
    const { symbol } = req.params;

    const lowCaseSymbol = symbol.toLowerCase();

    const modifyToken = await Tokens.findOneAndUpdate(
      { symbol: lowCaseSymbol },
      { isActive: false },
    );

    if (!modifyToken) {
      return res.status(400).j({
        message: 'Token not exists',
      });
    }

    return res.status(200).j({
      message: 'Token deleted successfully.',
    });
  },
];

export default deleteTokenHandler;
