import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../../models/User';
import signJWTToken from '../../../utils/signJWTToken';
import { emailValidation, passwordValidation } from '../../../utils/zodValidators';

const schema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

const loginHandler: RequestHandler = async (req, res) => {
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

  const { email, password } = result.data;

  const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

  if (!user) {
    return res.status(404).j({
      message: 'Login failed',
      error: {
        message: 'User not found',
      },
    });
  }

  const isMathPassword = await user.matchPassword(password);

  if (!isMathPassword) {
    return res.status(404).j({
      message: 'Login failed',
      error: {
        message: 'User not found',
      },
    });
  }

  const token = signJWTToken(user.id);

  return res.status(200).j({
    message: 'Login was successful',
    result: {
      token,
      name: user.name,
      logo: user.logo,
      email: user.email,
      apiKey: user.apiKey,
      tokens: user.tokens,
      methods: user.methods,
      isSubscribed: user.isSubscribed,
      minimumCancellableStreamDuration: user.minimumCancellableStreamDuration,
    },
  });
};

export default loginHandler;
