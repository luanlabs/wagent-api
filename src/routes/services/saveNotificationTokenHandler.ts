import { Request, Response } from 'express';

import User from '../../models/User';
import sendNotification from '../../services/notificationService';
import logger from "../../config/logger";

const MAX_NOTIFICATION_TOKENS = 5;

const saveNotificationTokenHandler = async (req: Request, res: Response): Promise<Response> => {
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

        if (user.notificationTokens.includes(token)) {
            return res.status(200).json({ message: 'Token already registered' });
        }

        if (user.notificationTokens.length >= MAX_NOTIFICATION_TOKENS) {
            return res.status(400).json({ message: `Maximum of ${MAX_NOTIFICATION_TOKENS} notification tokens allowed` });
        }

        user.notificationTokens.push(token);
        await user.save();

        const result = await sendNotification(token);

        return res.status(200).json({ result });
    } catch (error) {
        logger.error('Error handling notification:', error);
        return res.status(500).json({ error: error.message });
    }
};

export default saveNotificationTokenHandler;