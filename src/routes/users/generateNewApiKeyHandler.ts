import { RequestHandler } from 'express';
import generateApiKeyMiddleware from '../../middlewares/generateApiKeyMiddleware';
import User from '../../models/User';
import generateApiKey from '../../utils/generateApiKey';

const generateNewApiKeyHandler: RequestHandler[] = [
  generateApiKeyMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const newApiKey = generateApiKey();

    const user = await User.findOneAndUpdate({ _id: id }, { apiKey: newApiKey });

    if (!user) {
      return res.status(400).j({
        message: 'User not found',
      });
    }

    return res.status(200).j({
      result: newApiKey,
    });
  },
];

export default generateNewApiKeyHandler;
