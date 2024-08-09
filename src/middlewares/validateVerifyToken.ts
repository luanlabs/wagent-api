import { Request, Response } from 'express';

import User from '../models/User';

const validateVerifyToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: { message: 'Token is required and must be a string', code: 400 } });
        }

        const user = await User.findOne({
            verificationToken: token,
        });

        if (!user) {
            return res.status(404).json({ error: { message: 'Invalid or expired token', code: 404 } });
        }

        res.json({ message: 'Token is valid' });
    } catch (err) {
        console.error('Error in validateVerifyToken:', err);
        res.status(500).json({ error: { message: 'Error occurred!', code: 500 } });
    }
};

export default validateVerifyToken;