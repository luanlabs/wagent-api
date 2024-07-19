import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import getEnvs from '../config/getEnvs';
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

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: 
        ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  };

  try {
    await sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
