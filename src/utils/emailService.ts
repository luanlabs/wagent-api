import { createTransport } from 'nodemailer';
import logger from "../logger";
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
  sendMail(mailOptions, (error, info)=>{
    if (error) {
      logger.error('Error sending email: ' + error)
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};

export const sendVerificationEmail = (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
  };
  sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error)
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};

export const sendResetPasswordEmail = (email: string, token: string) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: 
        ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  };
  sendMail(mailOptions, (error, info)=>{
    if (error) {
      logger.error('Error sending email: ' + error)
    } else {
      logger.info(info.response);
    }
  });

};
