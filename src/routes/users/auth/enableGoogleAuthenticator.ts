import { z } from 'zod';
import { RequestHandler } from 'express';

import User, { IUser } from '../../../models/User';
import verifyGoogleToken from '../../../utils/google/verifyGoogleToken';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';

const enableGoogleAuthenticatorHandler: RequestHandler[] = [
  authorizationMiddleware,
  validatorMiddleware({
    body: z.object({
      googleToken: z.string().min(6).max(6),
    }),
  }),
  async (req, res) => {
    const { googleToken } = req.body;
    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (user.isGoogleAuthenticatorEnable) {
      return res.status(400).j({
        message: 'User already enabled google authenticator',
      });
    }

    const isVerifyToken = verifyGoogleToken(user.googleSecretKey!, googleToken);

    if (!isVerifyToken) {
      return res.status(400).j({
        message: 'Google authenticator token invalid',
        result: {
          isVerify: false,
        },
      });
    }

    user.isGoogleAuthenticatorEnable = true;

    await user.save();

    return res.status(200).j({
      message: 'Enable google authenticator successfully',
      result: {
        isVerify: true,
      },
    });
  },
];

export default enableGoogleAuthenticatorHandler;
