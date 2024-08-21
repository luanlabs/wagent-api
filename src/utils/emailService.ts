import nodemailer from 'nodemailer';

import logger from '../config/logger';
import getEnvs from '../config/getEnvs';
import verifyEmailTemplate from '../templates/verifyEmailTemplate';
import registrationTemplate from '../templates/registrationTemplate';
import resetPasswordTemplate from '../templates/resetPasswordTemplate';
import resetPasswordSuccessTemplate from '../templates/resetPasswordSuccessTemplate';
import { EmailTitles } from '../constants/emailTitles';
import complatedOrderSuccessTemplate from '../templates/complatedOrderSuccessTemplate';
import complatedOrderSuccessUserTemplate from '../templates/complatedOrderSuccessUserTemplate';

const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = getEnvs();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify((err, _) => {
  if (err) {
    logger.error('EMAIL: Failed to verify connection');
  } else {
    logger.info('EMAIL: Connected');
  }
});

const sendEmail = (to: string, subject: string, htmlContent: string): void => {
  const options = {
    from: EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      logger.error(`EMAIL: Failed to send email to ${to} - ${err}`);
    } else {
      logger.info(`EMAIL: Email sent to ${to} - ${info.response}`);
    }
  });
};

export const sendRegistrationEmail = (email: string): void => {
  const htmlContent = registrationTemplate(email);

  sendEmail(email, EmailTitles.Registration, htmlContent);
};

export const sendVerificationEmail = (email: string, token: string): void => {
  const verifyUrl = `${FRONTEND_URL}?token=${token}`;
  const htmlContent = verifyEmailTemplate(verifyUrl);

  sendEmail(email, EmailTitles.Verification, htmlContent);
};

export const sendResetPasswordEmail = (email: string, token: string): void => {
  const resetUrl = `${FRONTEND_URL}?token=${token}`;
  const htmlContent = resetPasswordTemplate(email, token, resetUrl);

  sendEmail(email, EmailTitles.ResetPassword, htmlContent);
};

export const sendResetPasswordSuccess = (email: string): void => {
  const htmlContent = resetPasswordSuccessTemplate(email);

  sendEmail(email, EmailTitles.ResetPasswordSuccess, htmlContent);
};

export const sendComplateOrderEmail = (email: string, orderId: string) => {
  const name = email.split('@')[0];
  const htmlContent = complatedOrderSuccessTemplate(name, orderId);

  sendEmail(email, EmailTitles.ComplateOrder, htmlContent);
};

export const sendComplateOrderUserEmail = (email: string, name: string, amount: string) => {
  const htmlContent = complatedOrderSuccessUserTemplate(name, amount);

  sendEmail(email, EmailTitles.ComplateOrder, htmlContent);
};
