import { z } from 'zod';
import { RequestHandler } from 'express';

import { IUser } from '../../models/User';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { MAXIMUM_NOTIFICATION_TOKENS } from '../../constants/notification';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const createNotificationTokenHandler: RequestHandler[] = [
  authorizationMiddleware,
  validatorMiddleware({
    body: z.object({
      token: z.string({
        required_error: 'push notification token is required',
        invalid_type_error: 'token must be a string',
      }),
    }),
  }),
  async (req, res) => {
    const { token } = req.body;

    const user = req.user as IUser;

    if (user.notificationTokens.includes(token)) {
      return res.status(400).j({ message: 'Token already registered' });
    }

    if (user.notificationTokens.length >= MAXIMUM_NOTIFICATION_TOKENS) {
      user.notificationTokens[0] = token;
    } else {
      user.notificationTokens.push(token);
    }

    await user.save();

    return res.status(200).j({ message: 'Notification token has been set' });
  },
];

export default createNotificationTokenHandler;
