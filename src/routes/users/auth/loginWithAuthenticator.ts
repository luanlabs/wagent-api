import { z } from 'zod';
import { RequestHandler } from 'express';

import User, { IUser } from '../../../models/User';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';
import verifyAuthenticatorToken from '../../../utils/authenticator/verifyAuthenticatorToken';

const loginWithAthenticarorHandler: RequestHandler[] = [
  authorizationMiddleware,
  validatorMiddleware({
    body: z.object({
      token: z.string().min(6).max(6),
    }),
  }),
  async (req, res) => {
    const { token } = req.body;
    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (!user.isAuthenticatorEnable) {
      return res.status(400).j({
        message: 'User not enabled authenticator',
      });
    }

    const isVerifyToken = verifyAuthenticatorToken(user.authenticatorSecretKey!, token);

    if (!isVerifyToken) {
      return res.status(400).j({
        message: 'Google authenticator token invalid',
        result: {
          isVerify: false,
        },
      });
    }

    return res.status(200).j({
      message: 'Verify user was successful',
      result: {
        isVerify: true,
      },
    });
  },
];

export default loginWithAthenticarorHandler;
