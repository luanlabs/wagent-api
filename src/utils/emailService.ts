import getEnvs from '../config/getEnvs';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import log from '../logger';

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = getEnvs();

const { sendMail } = createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT as string, 10),
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendRegistrationEmail = (email: string) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Registration Successful',
    text: 'Thank you for registering!',
  };

  sendMail(mailOptions, (error: Error | null, info: SMTPTransport.SentMessageInfo) => {
    if (error) {
      log.error({ message: error });
    } else {
      log.info({ message: 'Email sent: ' + info.response });
    }
  });
};
