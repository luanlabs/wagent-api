import { RequestHandler } from 'express';
import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../../models/User';

const SettingsSchema = z.object({
  methods: z.number(),
  minimumCancellableStreamDuration: z.number(),
  tokens: z.array(z.object({
    symbol: z.string(),
  })),
  isSubscribed: z.boolean(),
});

const ProfileSchema = z.object({
  name: z.string().optional(),
  logoSrc: z.string().optional(),
});

const editUserProfileHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        result: { success: false },
        error: {
          message: 'Authorization token is required',
          code: 401,
        },
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decodedToken !== 'object' || !decodedToken || !('userId' in decodedToken)) {
      return res.status(401).json({
        result: { success: false },
        error: {
          message: 'Invalid token payload',
          code: 401,
        },
      });
    }

    const userId = (decodedToken as JwtPayload).userId as string;
    const { settings, profile } = req.body;

    const settingsValidation = SettingsSchema.safeParse(settings);
    const profileValidation = ProfileSchema.safeParse(profile);

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

    if (!profileValidation.success) {
      return res.status(400).json({
        result: { success: false },
        error: {
          message: 'Invalid profile data',
          details: profileValidation.error.errors,
          code: 400,
        },
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            settings: settingsValidation.data,
            profile: profileValidation.data,
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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        result: { success: false },
        error: {
          message: 'Invalid or expired token',
          code: 401,
        },
      });
    }
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