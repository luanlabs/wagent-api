import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { sign } from '../../../utils/jwt';
import verifyGoogleToken from '../../../utils/google/verifyGoogleToken';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';

const loginHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
      password: passwordValidation,
      googleToken: z.string().min(6).max(6).optional(),
    }),
  }),
  async (req, res) => {
    const { email, password, googleToken } = req.body;

    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

    if (!user) {
      return res.status(404).j({
        message: 'Login failed',
        error: {
          message: 'User not found',
        },
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(404).j({
        message: 'Login failed',
        error: {
          message: 'User not found',
        },
      });
    }

    if (!user.isVerified) {
      return res.status(401).j({
        message: 'Login failed',
        error: {
          message: 'User is not verified',
        },
      });
    }

    if (user.isGoogleAuthenticatorEnable) {
      const isVerify = verifyGoogleToken(user.googleSecretKey!, googleToken);

      if (!isVerify) {
        return res.status(401).j({
          message: 'Login failed',
          error: {
            message: 'Google authenticator token is invalid',
          },
        });
      }
    }

    const token = sign(user.id);

    return res.status(200).j({
      message: 'Login was successful',
      result: {
        token,
      },
    });
  },
];

export default loginHandler;
