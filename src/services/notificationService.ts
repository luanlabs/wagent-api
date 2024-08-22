import admin from '../config/firebaseAdmin';
import logger from '../config/logger';

const sendNotification = async ( token ): Promise<string> => {
    const message = {
        token,
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