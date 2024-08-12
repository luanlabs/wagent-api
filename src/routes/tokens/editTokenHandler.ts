import { RequestHandler } from 'express';

import Token from '../../models/Token';
import editTokenMiddleware from '../../middlewares/editTokenMiddleware';
import adminAuthMIddleware from '../../middlewares/adminAuthMIddleware';

const editTokenHandler: RequestHandler[] = [
  adminAuthMIddleware,
  editTokenMiddleware,
  async (req, res) => {
    const { address } = req.params;
    const { logo } = req.body;

    const modifyToken = await Token.findOneAndUpdate({ address, isActive: true }, { logo });

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
