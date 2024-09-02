import { RequestHandler } from 'express';

import User, { IUser } from '../../models/User';
import randomString from '../../utils/randomString';
import authorizationMiddleware from '../../middlewares/authorizationMiddleware';

const generateNewApiKeyHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const newApiKey = randomString();

    const reqUser = req.user as IUser;
    const user = await User.findByIdAndUpdate(reqUser._id, { apiKey: newApiKey });

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    return res.status(200).j({
      message: 'User apikey has been changed',
      result: newApiKey,
    });
  },
];

export default generateNewApiKeyHandler;
