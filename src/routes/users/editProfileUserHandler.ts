import { RequestHandler } from 'express';
import { z } from 'zod';

import User, { IUser } from '../../models/User';

const settingsSchema = z.object({
  methods: z.number(),
  minimumCancellableStreamDuration: z.number(),
  tokens: z.array(
    z.object({
      symbol: z.string(),
    }),
  ),
  isSubscribed: z.boolean(),
});

const editUserProfileHandler: RequestHandler = async (req, res) => {
  try {
    if (!req.user || typeof req.user === 'string') {
      return res.status(401).j({
        message: 'User information is not available',
      });
    }

    const { _id } = req.user as IUser;
    const { settings } = req.body;

    const settingsValidation = settingsSchema.safeParse(settings);
    if (!settingsValidation.success) {
      return res.status(400).j({
        message: 'Invalid settings data',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          settings: settingsValidation.data,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    return res.status(200).j({
      message: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).j({
      message: 'Internal server error',
    });
  }
};

export default editUserProfileHandler;
