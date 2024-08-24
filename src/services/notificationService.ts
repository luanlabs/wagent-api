import admin from '../config/firebaseAdmin';
import logger from '../config/logger';

const sendNotification = async (tokens: string[]): Promise<string[]> => {
    const responses = [];
    for (const token of tokens) {
        const message = { token };
        try {
            const response = await admin.messaging().send(message);
            logger.info('Successfully sent message:', response);
            responses.push(response);
        } catch (error) {
            logger.error('Error sending message:', error);
            responses.push(`Failed to send message to ${token}`);
        }
    }
    return responses;
};

export default sendNotification;