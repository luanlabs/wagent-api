import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import { ONE_HOUR, FIFTEEN_MINUTES } from '../../../constants/Dates';
import randomString from '../../../utils/randomString';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';
import { sendVerificationEmail, sendRegistrationEmail } from '../../../utils/emailService';

const schema = z.object({
  email: emailValidation,
  password: passwordValidation,
  name: z.string().min(1, 'Store name is required'),
});

const registerHandler: RequestHandler = async (req, res) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation failed',
      error: {
        message: 'Validation failed',
        extras: result.error.errors,
      },
    });
  }

  const { email, name, password } = result.data;

  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

  if (user) {
    const currentTime = Date.now();

    if (
      user.verificationTokenExpiration &&
      currentTime < user.verificationTokenExpiration - (ONE_HOUR - FIFTEEN_MINUTES)
    ) {
      return res.status(429).json({
        message: 'You can only request a verification email every 15 minutes.',
      });
    }

    return res.status(401).json({
      message: 'Registration failed',
      error: {
        message: 'User already exists',
      },
    });
  }

  const apiKey = randomString();
  const verificationToken = randomString();

  const newUser = new User({
    name,
    email,
    apiKey,
    password,
    verificationToken,
    verificationTokenExpiration: Date.now() + ONE_HOUR,
    isVerified: false,
    isSubscribed: true,
  });

  await newUser.save();

  sendRegistrationEmail(email);
  sendVerificationEmail(email, verificationToken);

  return res.status(201).json({
    message: 'Verification email was sent',
  });
};

export default registerHandler;