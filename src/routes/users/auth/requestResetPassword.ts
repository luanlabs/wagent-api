import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import generateToken from '../../../utils/generateToken';
import canRequestToken from '../../../utils/canRequestToken';
import { emailValidation } from '../../../utils/zodValidators';
import { sendResetPasswordEmail } from '../../../utils/emailService';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';

const requestResetPasswordHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
    }),
  }),
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).j({
        message: 'Request reset password failed to complete',
        error: {
          message: 'User not found',
          extras: {
            email,
          },
        },
      });
    }

    if (!canRequestToken(user.resetPasswordTokenExpiration)) {
      return res.status(429).j({
        message: 'You can only request a password reset every 5 minutes.',
      });
    }

    const { token, expiration } = generateToken();

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiration = expiration;

    await user.save();

    sendResetPasswordEmail(email, token, user.name);

    return res.status(200).j({
      message: 'Reset password email was sent',
    });
  },
];

export default requestResetPasswordHandler;
