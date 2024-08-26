import { Request, Response } from 'express';

import User from '../../models/User';

const unsubscribeUserHandler = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.isSubscribed = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User unsubscribed successfully',
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe user',
    });
  }
};

export default unsubscribeUserHandler;
