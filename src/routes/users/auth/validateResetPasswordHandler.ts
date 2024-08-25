import { z } from 'zod';
import { Request, Response } from 'express';

import User from '../../../models/User';
import { tokenValidation } from '../../../utils/zodValidators';

const schema = z.object({
  token: tokenValidation,
});

const validateResetPasswordHandler = async (req: Request, res: Response) => {
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

  const { token } = result.data;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).j({
      message: 'Token is invalid',
      error: {
        message: 'Token is invalid',
        extras: {
          token,
        },
      },
    });
  }

  return res.status(200).j({ message: 'Token is valid' });
};
export default validateResetPasswordHandler;
