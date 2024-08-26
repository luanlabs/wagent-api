import { z } from 'zod';
import { Request, Response } from 'express';

import User from '../../../models/User';

const schema = z.object({
  token: z.string().min(5),
});

const verifyHandler = async (req: Request, res: Response) => {
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
    verificationToken: token,
    verificationTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).j({
      message: 'User verification failed',
      error: {
        message: 'Invalid or expired token',
        extras: {
          token,
        },
      },
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiration = undefined;

  await user.save();

  return res.status(200).j({
    message: 'User verification was sucessful',
  });
};
export default verifyHandler;
