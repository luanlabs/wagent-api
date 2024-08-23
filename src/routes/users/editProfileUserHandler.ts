import { RequestHandler } from 'express';

import User from '../../models/User';

const editUserProfileHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.user;

    const { settings, profile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            settings,
            profile,
          }
        },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        result: { success: false },
        error: {
          message: 'User not found',
          code: 404,
        },
      });
    }

    return res.status(200).json({
      result: {
        success: true,
        settings: updatedUser.settings,
        profile: updatedUser.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      result: { success: false },
      error: {
        message: error.message || 'An error occurred while updating user settings',
        code: 500,
      },
    });
  }
};

export default editUserProfileHandler;
