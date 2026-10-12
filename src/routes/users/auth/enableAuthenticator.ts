import { z } from 'zod';
import { RequestHandler } from 'express';

import User, { IUser } from '../../../models/User';
import verifyAuthenticatorToken from '../../../utils/authenticator/verifyAuthenticatorToken';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';

const enableAuthenticatorHandler: RequestHandler[] = [
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

    if (user.isAuthenticatorEnable) {
      return res.status(400).j({
        message: 'User already enabled authenticator',
      });
    }

    if (!user.authenticatorSecretKey) {
      return res.status(400).j({
        message: 'Request authenticator setup first',
      });
    }

    const isVerifyToken = verifyAuthenticatorToken(user.authenticatorSecretKey, token);

    if (!isVerifyToken) {
      return res.status(400).j({
        message: 'Authenticator token invalid',
        result: {
          isVerify: false,
        },
      });
    }

    user.isAuthenticatorEnable = true;

    await user.save();

    return res.status(200).j({
      message: 'Enable authenticator successfully',
      result: {
        isVerify: true,
      },
    });
  },
];

export default enableAuthenticatorHandler;
