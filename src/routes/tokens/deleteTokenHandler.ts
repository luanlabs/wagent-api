import { RequestHandler } from 'express';

import Token from '../../models/Token';
import adminAuthMIddleware from '../../middlewares/adminAuthMIddleware';
import deleteTokenMiddleware from '../../middlewares/deleteTokenMiddleware';

const deleteTokenHandler: RequestHandler[] = [
  adminAuthMIddleware,
  deleteTokenMiddleware,
  async (req, res) => {
    const { address } = req.params;

    const modifyToken = await Token.findOneAndUpdate(
      { address, isActive: true },
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
