import { z } from 'zod';
import { RequestHandler } from 'express';

import User, { IUser } from '../../models/User';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';
import UserToken from '../../models/UserToken';
import Token from '../../models/Token';

const editUserHandler: RequestHandler[] = [
  authorizationMiddleware,
  validatorMiddleware({
    body: z.object({
      name: z.string().min(3).optional(),
      logo: z.string().url().optional(),
      isSubscribed: z.boolean().optional(),
      methods: z.number().min(1).max(7).optional(),
      tokens: z.array(z.string().min(5)).optional(),
      minimumCancellableStreamDuration: z.number().int().positive().optional(),
    }),
  }),
  async (req, res) => {
    const { name, logo, isSubscribed, methods, tokens, minimumCancellableStreamDuration } =
      req.body;

    const reqUser = req.user as IUser;

    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (name) {
      user.name = name;
    }

    if (logo) {
      user.logo = logo;
    }

    if (methods) {
      user.methods = methods;
    }

    if (isSubscribed !== undefined) {
      user.isSubscribed = isSubscribed;
    }

    if (minimumCancellableStreamDuration !== undefined) {
      user.minimumCancellableStreamDuration = minimumCancellableStreamDuration;
    }

    if (tokens) {
      const userTokens = await UserToken.find({ user: user._id });

      for (const token of tokens) {
        const isAlreadySelected = userTokens.find((x) => x.token === token);
        const tokenExists = await Token.findById(token);

        if (tokenExists) {
          const userToken = await UserToken.find({ user: user._id, token });

          if (!userToken) {
            const newUserToken = new UserToken({ user: user._id, token });

            await newUserToken.save();
          }
        }
      }
    }

    return res.status(200).j({
      message: 'User settings updated successfully',
    });
  },
];

export default editUserHandler;
