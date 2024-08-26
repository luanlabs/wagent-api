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
      return res.status(401).json({
        result: { success: false },
        error: {
          message: 'User information is not available',
          code: 401,
        },
      });
    }

    const { _id } = req.user as IUser;

    const { settings, profile } = req.body;

    const settingsValidation = settingsSchema.safeParse(settings);

    if (!settingsValidation.success) {
      return res.status(400).json({
        result: { success: false },
        error: {
          message: 'Invalid settings data',
          details: settingsValidation.error.errors,
          code: 400,
        },
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
  } catch (e) {}
};

export default editUserProfileHandler;
