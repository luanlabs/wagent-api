import { RequestHandler } from 'express';

import { IUser } from '../../models/User';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';
import getUserTokens from '../../utils/getUserTokens';

const getUserDetailsHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const user = req.user as IUser;

    const tokens = await getUserTokens(user._id);

    return res.j({
      message: 'User details',
      result: {
        name: user.name,
        logo: user.logo,
        email: user.email,
        apiKey: user.apiKey,
        tokens: tokens,
        address: user.address,
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
