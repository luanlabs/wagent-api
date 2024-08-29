import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { ONE_HOUR } from '../../../constants/Dates';
import randomString from '../../../utils/randomString';
import { emailValidation } from '../../../utils/zodValidators';
import { sendVerificationEmail } from '../../../utils/emailService';

const schema = z.object({
  email: emailValidation,
});

const registerHandler: RequestHandler = async (req, res) => {
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
    return res.status(401).j({
      message: 'Request verify user failed',
      error: {
        message: 'User not found',
      },
    });
  }

  const verificationToken = randomString();

  user.verificationToken = verificationToken;
  user.verificationTokenExpiration = Date.now() + ONE_HOUR;

  await user.save();

  sendVerificationEmail(email, verificationToken);

  return res.status(201).j({
    message: 'Verification email was sent',
  });
};

export default registerHandler;
