import { z } from 'zod';
import { RequestHandler } from 'express';

import Token from '../../models/Token';
import UserToken from '../../models/UserToken';
import User, { IUser } from '../../models/User';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';
import { addressValidation } from '../../utils/zodValidators';

const editUserHandler: RequestHandler[] = [
  authorizationMiddleware,
  validatorMiddleware({
    body: z.object({
      logo: z.string().url().optional(),
      name: z.string().min(3).optional(),
      isSubscribed: z.boolean().optional(),
      address: addressValidation.optional(),
      methods: z.number().min(1).max(7).optional(),
      tokens: z.array(z.string().min(5)).optional(),
      minimumCancellableStreamDuration: z.number().int().positive().optional(),
    }),
  }),
  async (req, res) => {
    const { name, logo, address, isSubscribed, methods, tokens, minimumCancellableStreamDuration } =
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

    if (address) {
      user.address = address;
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
      await UserToken.deleteMany({ user: user._id });

      const usertokens = [];

      for (const tokenId of tokens) {
        const tokenExists = await Token.findById(tokenId);

        if (tokenExists) {
          usertokens.push({
            user: user._id,
            token: tokenId,
          });
        }
      }

      await UserToken.insertMany(usertokens);
    }

    await user.save();

    return res.status(200).j({
      message: 'User settings updated successfully',
    });
  },
];

export default editUserHandler;
