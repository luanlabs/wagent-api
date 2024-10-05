import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import Token from '../../../models/Token';
import UserToken from '../../../models/UserToken';
import randomString from '../../../utils/randomString';
import generateToken from '../../../utils/generateToken';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import {
  emailValidation,
  addressValidation,
  passwordValidation,
} from '../../../utils/zodValidators';
import { sendVerificationEmail, sendRegistrationEmail } from '../../../utils/emailService';

const registerHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      email: emailValidation,
      address: addressValidation,
      password: passwordValidation,
      name: z.string().min(3, 'Store name is required'),
    }),
  }),
  async (req, res) => {
    const { name, email, address, password } = req.body;

    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

    if (user) {
      return res.status(401).j({
        message: 'Registration failed',
        error: {
          message: 'User already exists',
        },
      });
    }

    const apiKey = randomString(15);
    const subscribeToken = randomString();
    const { token, expiration } = generateToken();

    const newUser = new User({
      name,
      email,
      apiKey,
      address,
      password,
      subscribeToken,
      verificationToken: token,
      verificationTokenExpiration: expiration,
      isAdmin: false,
      isVerified: false,
      isSubscribed: true,
      methods: 1,
      notificationTokens: [],
      minimumCancellableStreamDuration: 0,
      isGoogleAuthenticatorEnable: false,
    });

    await newUser.save();

    try {
      const usertokens = [];
      const tokens = await Token.find();

      for (const token of tokens) {
        usertokens.push({
          user: newUser._id,
          token: token._id,
        });
      }

      await UserToken.insertMany(usertokens);
    } catch (e) {}

    sendRegistrationEmail(email, name);
    sendVerificationEmail(email, token, name);

    return res.status(201).j({
      message: 'Verification email was sent',
    });
  },
];

export default registerHandler;
