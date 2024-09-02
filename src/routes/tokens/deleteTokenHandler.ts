import { RequestHandler } from 'express';

import Token from '../../models/Token';
import findUserToken from '../../middlewares/findUserToken';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestValueMiddleware from '../../middlewares/validateRequestValueMiddleware';
import { deleteTokenSchema } from '../../schemas/tokenSchema';

const deleteTokenHandler: RequestHandler[] = [
  findUserToken,
  authMiddleware,
  validateRequestValueMiddleware(deleteTokenSchema),
  async (req, res) => {
    const { symbol } = req.params;

    const modifyToken = await Token.findOneAndUpdate(
      { symbol: new RegExp(`^${symbol}$`, 'i'), isActive: true },
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
