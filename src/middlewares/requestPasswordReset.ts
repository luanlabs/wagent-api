import {Request, Response} from 'express';
import crypto from 'crypto';

import User from '../models/User';
import {sendResetPasswordEmail} from '../utils/emailService';

export const requestPasswordReset = async (req: Request, res: Response) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({error: {message: 'User not found', code: 404}});
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        sendResetPasswordEmail(user.email, resetToken);

        res.json({message: 'Password reset link sent'});
    } catch (err) {
        res.status(500).json({error: {message: 'Error occurred!', code: 500}});
    }
};