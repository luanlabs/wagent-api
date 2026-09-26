import logger from '../config/logger';
import getMessaging from '../config/firebase';

const sendNotification = async (tokens: string[], amount: string) => {
  const responses = [];

  for (const token of tokens) {
    const message = { token, body: `An order was submitted to your account with $${amount} price` };

    try {
      const response = await getMessaging().send(message);
      const txt = `Notification: Sent to ${token}, response: ${response}`;

      logger.info(txt);
      responses.push(txt);
    } catch (error) {
      const txt = `Notification: Failed to send to ${token}, error: ${error}`;

      logger.error(txt);
      responses.push(txt);
    }
  }

  return responses;
};

export default sendNotification;
