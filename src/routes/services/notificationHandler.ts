import { Request, Response } from 'express';

import sendNotification from '../../services/notificationService';

const sendNotificationHandler = async (req: Request, res: Response): Promise<Response> => {
    const { token, title, body } = req.body;

    try {
        const result = await sendNotification({ token, title, body });
        return res.status(200).json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
export default sendNotificationHandler;
