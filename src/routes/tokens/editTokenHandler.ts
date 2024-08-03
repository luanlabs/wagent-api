import { RequestHandler } from 'express';

import Tokens from '../../models/Tokens';
import editTokenMiddleware from '../../middlewares/editTokenMiddleware';

const editTokenHandler: RequestHandler[] = [
  editTokenMiddleware,
  async (req, res) => {
    const { symbol } = req.params;
    const { logo } = req.body;

    const lowCaseSymbol = symbol.toLowerCase();

    const modifyToken = await Tokens.findOneAndUpdate({ symbol: lowCaseSymbol }, { logo });

    if (!modifyToken) {
      return res.status(400).j({
        message: 'Token not exists',
      });
    }

    return res.status(200).j({
      result: modifyToken,
    });
  },
];

export default editTokenHandler;
