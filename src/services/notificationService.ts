import admin from '../config/firebaseAdmin';
import logger from "../config/logger";

interface NotificationMessage {
    token: string;
    title: string;
    body: string;
}

const sendNotification = async ({ token, title, body }: NotificationMessage): Promise<string> => {
    const message = {
        token,
        notification: {
            title,
            body,
        },
    };

    try {
        const response = await admin.messaging().send(message);
        logger.info('Successfully sent message:', response);
        return response;
    } catch (error) {
        logger.error('Error sending message:', error);
        throw error;
    }
};

export default sendNotification;