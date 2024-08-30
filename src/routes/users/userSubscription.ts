import { Request, Response } from 'express';

import User from '../../models/User';

const userSubscription = async (req: Request, res: Response): Promise<Response> => {
  const { userId, subscribe } = req.body;

  try {
    if (!userId) {
      return res.status(400).j({
        message: 'User ID is required',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (!user.settings) {
      user.settings = {
        methods: 0,
        minimumCancellableStreamDuration: 0,
        tokens: [],
        isSubscribed: false,
      };
    }

    user.settings.isSubscribed = subscribe;
    await user.save();

    const message = subscribe ? 'User subscribed successfully' : 'User unsubscribed successfully';

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Error handling subscription:', error);
    return res.status(500).j({
      message: 'Failed to handle subscription',
    });
  }
};

export default userSubscription;
