import { z } from 'zod';
import { Request, Response } from 'express';

import User from '../../../models/User';
import { passwordValidation } from '../../../utils/zodValidators';
import { sendResetPasswordSuccess } from '../../../utils/emailService';

const schema = z.object({
  token: z.string().min(5),
  password: passwordValidation,
});

const resetPasswordHandler = async (req: Request, res: Response) => {
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

  const { token, password } = result.data;

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
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiration = undefined;

  await user.save();

  sendResetPasswordSuccess(user.email);

  return res.status(200).j({ message: 'Password has been reset' });
};
export default resetPasswordHandler;
