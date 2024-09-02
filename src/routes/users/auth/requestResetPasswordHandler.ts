import { z } from 'zod';
import { Request, Response } from 'express';

import User from '../../../models/User';
import randomString from '../../../utils/randomString';
import { emailValidation } from '../../../utils/zodValidators';
import { sendResetPasswordEmail } from '../../../utils/emailService';
import canRequestPasswordResetToken from '../../../utils/tokenHelpers';
import { ONE_HOUR } from '../../../constants/Dates';

const schema = z.object({
  email: emailValidation,
});

const requestResetPasswordHandler = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).j({
      message: 'Validation failed',
      error: {
        message: 'Validation failed',
        extras: result.error.errors,
      },
    });
  }

  const { email } = result.data;

  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

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

  if (!canRequestPasswordResetToken(user)) {
    return res.status(429).j({
      message: 'You can only request a password reset every 15 minutes.',
    });
  }

  user.resetPasswordToken = randomString();
  user.resetPasswordTokenExpiration = Date.now() + ONE_HOUR;

  await user.save();

  sendResetPasswordEmail(user.email, user.resetPasswordToken);

  return res.status(200).j({
    message: 'Reset password email was sent',
  });
};

export default requestResetPasswordHandler;