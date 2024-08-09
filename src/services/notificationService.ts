import admin from '../config/firebaseAdmin';

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
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export default sendNotification;