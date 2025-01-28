import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { sign } from '../../../utils/jwt';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';
import verifyAuthenticatorToken from '../../../utils/authenticator/verifyAuthenticatorToken';

const loginHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
      password: passwordValidation,
      authToken: z.string().min(6).max(6).optional(),
    }),
  }),
  async (req, res) => {
    const { email, password, authToken } = req.body;

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

    const isEnabledAuthenticator = user.isAuthenticatorEnable || false;

    if (isEnabledAuthenticator) {
      if (!authToken) {
        return res.status(401).j({
          message: 'Login failed',
          error: {
            message: 'Auth token is required',
          },
        });
      }

      const isVerifiedAuthentocator = verifyAuthenticatorToken(
        user.authenticatorSecretKey!,
        authToken,
      );

      if (!isVerifiedAuthentocator) {
        return res.status(400).j({
          message: 'Login failed',
          error: {
            message: 'The authentication token is incorrect',
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
