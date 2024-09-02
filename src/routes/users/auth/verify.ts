import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';

const verifyHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      token: z.string().min(5),
    }),
  }),
  async (req, res) => {
    const { token } = req.body;

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
    user.verificationToken = '';
    user.verificationTokenExpiration = 0;

    await user.save();

    return res.status(200).j({
      message: 'User verification was sucessful',
    });
  },
];

export default verifyHandler;
