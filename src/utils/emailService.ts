import nodemailer from 'nodemailer';

import logger from '../config/logger';
import getEnvs from '../config/getEnvs';
import verifyEmailTemplate from '../templates/verifyEmailTemplate';
import registrationTemplate from '../templates/registrationTemplate';
import resetPasswordTemplate from '../templates/resetPasswordTemplate';
import resetPasswordSuccessTemplate from '../templates/resetPasswordSuccessTemplate';
import { EmailTitles } from '../constants/emailTitles';
import sendPayerCompleteOrderTemplate from '../templates/sendPayerCompleteOrderTemplate';
import sendUserCompleteOrderTemplate from '../templates/sendUserCompleteOrderTemplate';

const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = getEnvs();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify((err, _) => {
  if (err) {
    console.log(err);

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
      console.error(err);

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
  const htmlContent = resetPasswordTemplate(resetUrl);

  sendEmail(email, EmailTitles.ResetPassword, htmlContent);
};

export const sendResetPasswordSuccess = (email: string): void => {
  const htmlContent = resetPasswordSuccessTemplate(email);

  sendEmail(email, EmailTitles.ResetPasswordSuccess, htmlContent);
};

export const sendPayerCompleteOrderEmail = (email: string, orderId: string) => {
  const htmlContent = sendPayerCompleteOrderTemplate(orderId);

  sendEmail(email, EmailTitles.CompleteOrder, htmlContent);
};

export const sendUserCompleteOrderEmail = (email: string, name: string, amount: string) => {
  const htmlContent = sendUserCompleteOrderTemplate(name, amount);

  sendEmail(email, EmailTitles.CompleteOrder, htmlContent);
};
