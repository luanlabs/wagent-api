import { Request, Response } from 'express';
import User from '../models/User';

export const validateResetToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ error: { message: 'Invalid or expired token', code: 404 } });
        }

        res.json({ message: 'Token is valid' });
    } catch (err) {
        console.error('Error in validateResetToken:', err);
        res.status(500).json({ error: { message: 'Error occurred!', code: 500 } });
    }
};