import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import generateToken from '../../../utils/generateToken';
import { emailValidation } from '../../../utils/zodValidators';
import { sendVerificationEmail } from '../../../utils/emailService';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';

const requestVerificationTokenHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
    }),
  }),
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

    if (!user) {
      return res.status(401).j({
        message: 'Request verification token failed',
        error: {
          message: 'User not found',
        },
      });
    }

    if (user.isVerified) {
      return res.status(401).j({
        message: 'Request verification token failed',
        error: {
          message: 'User is already verified',
        },
      });
    }

    const { token, expiration } = generateToken();

    user.verificationToken = token;
    user.verificationTokenExpiration = expiration;

    await user.save();

    sendVerificationEmail(email, token);

    return res.status(201).j({
      message: 'Verification email was sent',
    });
  },
];

export default requestVerificationTokenHandler;
