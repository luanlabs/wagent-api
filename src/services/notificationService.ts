import admin from '../config/firebaseAdmin';
import logger from '../config/logger';

const sendNotification = async (tokens: string[]): Promise<string[]> => {
    const responses = [];
    for (const token of tokens) {
        const message = { token };
        try {
            const response = await admin.messaging().send(message);
            logger.info(`Notification: Sent to ${token}, response: ${response}`);
            responses.push(`Notification: Sent to ${token}, response: ${response}`);
        } catch (error) {
            logger.error(`Notification: Failed to send to ${token}, error: ${error}`);
            responses.push(`Notification: Failed to send to ${token}, error: ${error}`);
        }
    }
    return responses;
};

export default sendNotification;