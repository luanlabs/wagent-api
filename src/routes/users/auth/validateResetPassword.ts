import { RequestHandler } from 'express';

import User from '../../../models/User';

const validateResetPasswordHandler: RequestHandler = async (req, res) => {
  const { token } = req.params;

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
