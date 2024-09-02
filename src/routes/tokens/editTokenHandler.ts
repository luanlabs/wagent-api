import { RequestHandler } from 'express';

import Token from '../../models/Token';
import findUserToken from '../../middlewares/findUserToken';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestValueMiddleware from '../../middlewares/validateRequestValueMiddleware';
import { editTokenSchema } from '../../schemas/tokenSchema';

const editTokenHandler: RequestHandler[] = [
  findUserToken,
  authMiddleware,
  validateRequestValueMiddleware(editTokenSchema),
  async (req, res) => {
    const { symbol } = req.params;
    const { logo } = req.body;

    const modifyToken = await Token.findOneAndUpdate(
      { symbol: new RegExp(`^${symbol}$`, 'i'), isActive: true },
      { logo },
    );

    if (!modifyToken) {
      return res.status(400).j({
        message: 'Token not exists',
      });
    }

    return res.status(200).j({
      message: 'TODO',
      result: modifyToken,
    });
  },
];

export default editTokenHandler;
