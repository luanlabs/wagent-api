import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { passwordValidation } from '../../../utils/zodValidators';
import { sendResetPasswordSuccess } from '../../../utils/emailService';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';

const resetPasswordHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      token: z.string().min(5),
      password: passwordValidation,
    }),
  }),
  async (req, res) => {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).j({
        message: 'Reset password failed',
        error: {
          message: 'Invalid or expired token',
          extras: {
            token,
          },
        },
      });
    }

    user.password = password;
    user.resetPasswordToken = '';
    user.resetPasswordTokenExpiration = 0;

    await user.save();

    sendResetPasswordSuccess(user.email);

    return res.status(200).j({ message: 'Password has been reset' });
  },
];

export default resetPasswordHandler;
