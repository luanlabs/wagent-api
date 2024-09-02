import { Request, Response } from 'express';

import User from '../../models/User';
import logger from "../../config/logger";

const unsubscribeNotificationTokenHandler = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Notification token is required' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notificationTokens = user.notificationTokens.filter((t) => t !== token);
        await user.save();

        return res.status(200).json({ message: 'Token unsubscribed successfully' });
    } catch (error) {
        logger.error('Error unsubscribing notification token:', error);
        return res.status(500).json({ error: error.message });
    }
};

export default unsubscribeNotificationTokenHandler;