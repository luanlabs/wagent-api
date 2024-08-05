import { RequestHandler } from 'express';

import Token from '../../models/Token';
import editTokenMiddleware from '../../middlewares/editTokenMiddleware';
import adminAuthPasswordMiddleware from '../../middlewares/adminAuthPasswordMiddleware';

const editTokenHandler: RequestHandler[] = [
  adminAuthPasswordMiddleware,
  editTokenMiddleware,
  async (req, res) => {
    const { symbol } = req.params;
    const { logo } = req.body;

    const lowCaseSymbol = symbol.toLowerCase();

    const modifyToken = await Token.findOneAndUpdate(
      { symbol: lowCaseSymbol, isActive: true },
      { logo },
    );

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
