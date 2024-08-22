import { Request, Response } from 'express';

import UserToken from "../../models/UserToken";
import sendNotification from '../../services/notificationService';
import logger from "../../config/logger";

const saveNotificationTokenHandler = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).j({ message: 'Notification token is required' });
    }

    if (!req.user) {
        return res.status(401).j({ message: 'Unauthorized request' });
    }

    try {
        const newUserToken = new UserToken({
            token: token,
            userId: req.user as string
        });

        await newUserToken.save();

        const result = await sendNotification(token);

        return res.status(200).j({ result: result });
    } catch (error) {
        logger.error('Error handling notification:', error);
        return res.status(500).j({ error: error.message });
    }
};

export default saveNotificationTokenHandler;
