import { Request, Response } from 'express';

import UserToken from "../../models/UserToken";
import sendNotification from '../../services/notificationService';

const saveNotificationTokenHandler = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const newUserToken = new UserToken({ token });
        await newUserToken.save();

        const result = await sendNotification(token);

        return res.status(200).j({ result: result });
    } catch (error) {
        console.error('Error handling notification:', error);
        return res.status(500).j({ error: error.message });
    }
};

export default saveNotificationTokenHandler;
