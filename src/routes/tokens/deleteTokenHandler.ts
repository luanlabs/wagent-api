import { RequestHandler } from 'express';

import Token from '../../models/Token';
import adminAuthMIddleware from '../../middlewares/adminAuthMIddleware';
import deleteTokenMiddleware from '../../middlewares/deleteTokenMiddleware';

const deleteTokenHandler: RequestHandler[] = [
  adminAuthMIddleware,
  deleteTokenMiddleware,
  async (req, res) => {
    const { symbol } = req.params;

    const lowCaseSymbol = symbol.toLowerCase();

    const modifyToken = await Token.findOneAndUpdate(
      { symbol: lowCaseSymbol, isActive: true },
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
