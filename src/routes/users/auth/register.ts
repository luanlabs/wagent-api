import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import randomString from '../../../utils/randomString';
import generateToken from '../../../utils/generateToken';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';
import { sendVerificationEmail, sendRegistrationEmail } from '../../../utils/emailService';

const registerHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
      password: passwordValidation,
      name: z.string().min(3, 'Store name is required'),
    }),
  }),
  async (req, res) => {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

    if (user) {
      return res.status(401).j({
        message: 'Registration failed',
        error: {
          message: 'User already exists',
        },
      });
    }

    const apiKey = randomString();
    const { token, expiration } = generateToken();

    const newUser = new User({
      name,
      email,
      apiKey,
      password,
      verificationToken: token,
      verificationTokenExpiration: expiration,
      isAdmin: false,
      isVerified: false,
      isSubscribed: true,
      tokens: [],
      methods: 1,
      minimumCancellableStreamDuration: 0,
    });

    await newUser.save();

    // todo: ADD tokens to the newly created user
    // todo: Add basic settings if needed

    sendRegistrationEmail(email, name);
    sendVerificationEmail(email, token, name);

    return res.status(201).j({
      message: 'Verification email was sent',
    });
  },
];

export default registerHandler;
