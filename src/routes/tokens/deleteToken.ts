import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../models/Token';
import exactCaseInsensitive from '../../utils/exactCaseInsensitive';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';
import UserToken from '../../models/UserToken';

const deleteTokenHandler: RequestHandler[] = [
  authorizationMiddleware,
  adminMiddleware,
  validatorMiddleware({
    params: z.object({
      symbol: z.string({
        required_error: 'symbol is required',
        invalid_type_error: 'symbol must be a string',
      }),
    }),
  }),
  async (req, res) => {
    const { symbol } = req.params;

    const modifyToken = await Token.findOneAndDelete({
      symbol: exactCaseInsensitive(symbol),
    });

    if (!modifyToken) {
      return res.status(404).j({
        message: 'Token does not exist',
      });
    }

    await UserToken.deleteMany({ token: modifyToken._id });

    return res.status(200).j({
      message: 'Token deleted successfully.',
    });
  },
];

export default deleteTokenHandler;
