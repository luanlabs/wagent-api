import { RequestHandler } from 'express';

import { IUser } from '../../models/User';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const getUserDetailsHandler: RequestHandler[] = [
  authorizationMiddleware,
  (req, res) => {
    const user = req.user as IUser;

    return res.j({
      message: 'User details',
      result: {
        name: user.name,
        logo: user.logo,
        email: user.email,
        apiKey: user.apiKey,
        // todo
        tokens: user.tokens,
        isAdmin: user.isAdmin,
        methods: user.methods,
        isVerified: user.isVerified,
        isSubscribed: user.isSubscribed,
        minimumCancellableStreamDuration: user.minimumCancellableStreamDuration,
      },
    });
  },
];

export default getUserDetailsHandler;
