import {Request, Response} from 'express';
import crypto from 'crypto';

import User from '../models/User';
import {sendResetPasswordEmail} from '../utils/emailService';

export const requestPasswordReset = async (req: Request, res: Response) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({error: {message: 'User not found', code: 400}});
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

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: { message: 'Invalid or expired token', code: 400 } });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ error: { message: 'Error occurred!', code: 500 } });
    }
};