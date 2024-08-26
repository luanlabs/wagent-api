import { RequestHandler } from 'express';

import User from '../../models/User';
import randomString from '../../utils/randomString';
import authMiddleware from '../../middlewares/authMiddleware';

const generateNewApiKeyHandler: RequestHandler[] = [
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const newApiKey = randomString();

    const user = await User.findOneAndUpdate({ _id: id }, { apiKey: newApiKey });

    if (!user) {
      return res.status(400).j({
        message: 'User not exist',
      });
    }

    return res.status(200).j({
      message: 'TODO',
      result: newApiKey,
    });
  },
];

export default generateNewApiKeyHandler;
