import { z } from 'zod';
import { RequestHandler } from 'express';

import User, { IUser } from '../../models/User';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

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
      // for (const token of tokens) {
      // todo
      // addTokenToUser(token);
      // }
    }

    return res.status(200).j({
      message: 'User settings updated successfully',
    });
  },
];

export default editUserHandler;
