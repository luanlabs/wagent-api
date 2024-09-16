import { z } from 'zod';
import { RequestHandler } from 'express';

import User from '../../models/User';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

const userSubscriptionHandler: RequestHandler[] = [
  validatorMiddleware({
    body: z.object({
      isSubscribed: z.boolean(),
      token: z.string().min(5),
    }),
  }),
  async (req, res) => {
    const { token, isSubscribed } = req.body;

    const user = await User.findOne({ subscribeToken: token });

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    user.isSubscribed = isSubscribed;

    await user.save();

    const message = isSubscribed ? 'subscribed' : 'unsubscribed';

    return res.status(200).j({
      message: `User ${message} successfully`,
    });
  },
];

export default userSubscriptionHandler;
