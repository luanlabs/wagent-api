import { RequestHandler } from 'express';
import { z } from 'zod';

import User, { IUser } from '../../models/User';

const userUpdateSchema = z.object({
  methods: z.number().min(1).max(7).optional(),
  minimumCancellableStreamDuration: z.number().positive().optional(),
  tokens: z.array(
    z.object({
      symbol: z.string().min(1),
    }),
  ).optional(),
  isSubscribed: z.boolean().optional(),
});

const editUserProfileHandler: RequestHandler = async (req, res) => {
  try {
    if (!req.user || typeof req.user === 'string') {
      return res.status(401).j({
        message: 'User information is not available',
      });
    }

    const { _id } = req.user as IUser;
    const userUpdates = req.body;

    const validation = userUpdateSchema.safeParse(userUpdates);
    if (!validation.success) {
      return res.status(400).j({
        message: 'Invalid data',
      });
    }

    const { methods, minimumCancellableStreamDuration, tokens, isSubscribed } = validation.data;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...(methods !== undefined && { methods }),
          ...(minimumCancellableStreamDuration !== undefined && { minimumCancellableStreamDuration }),
          ...(tokens !== undefined && { tokens }),
          ...(isSubscribed !== undefined && { isSubscribed }),
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
      message: 'User settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).j({
      message: 'Internal server error',
    });
  }
};

export default editUserProfileHandler;