import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { sign } from '../../../utils/jwt';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';

const loginHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
      password: passwordValidation,
    }),
  }),
  async (req, res) => {
    const { email, password } = req.body;

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
