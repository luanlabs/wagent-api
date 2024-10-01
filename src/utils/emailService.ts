import nodemailer from 'nodemailer';

import envs from '../config/envs';
import logger from '../config/logger';
import { EmailTitles } from '../constants/email';
import verifyEmailTemplate from '../templates/verifyEmailTemplate';
import registrationTemplate from '../templates/registrationTemplate';
import resetPasswordTemplate from '../templates/resetPasswordTemplate';
import resetPasswordSuccessTemplate from '../templates/resetPasswordSuccessTemplate';
import sendUserCompleteOrderTemplate from '../templates/sendUserCompleteOrderTemplate';
import sendPayerCompleteOrderTemplate from '../templates/sendPayerCompleteOrderTemplate';

const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = envs();

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    logger.error('EMAIL: Failed to verify connection');
  } else {
    logger.info('EMAIL: Connected');
  }
});

const sendEmail = (to: string, subject: string, htmlContent: string) => {
  const options = {
    from: EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      logger.error(`EMAIL: Failed to send email to ${to} - Error: ${err}`);
    } else {
      logger.info(`EMAIL: Email sent to ${to} - ${info.response}`);
    }
  });
};

export const sendRegistrationEmail = (email: string, name: string) => {
  const html = registrationTemplate(name);

  sendEmail(email, EmailTitles.Registration, html);
};

export const sendVerificationEmail = (email: string, token: string, name: string) => {
  const verifyUrl = `${FRONTEND_URL}/verify/${token}`;
  const html = verifyEmailTemplate(name, verifyUrl);

  sendEmail(email, EmailTitles.Verification, html);
};

export const sendResetPasswordEmail = (email: string, token: string, name: string) => {
  const resetUrl = `${FRONTEND_URL}/password/reset/${token}`;
  const html = resetPasswordTemplate(name, resetUrl);

  sendEmail(email, EmailTitles.ResetPassword, html);
};

export const sendResetPasswordSuccess = (email: string, name: string) => {
  const html = resetPasswordSuccessTemplate(name);

  sendEmail(email, EmailTitles.ResetPasswordSuccess, html);
};

export const sendPayerCompleteOrderEmail = (
  email: string,
  orderId: string,
  amount: string,
  token: string,
  method: string,
  name: string,
  submittedAt: string,
) => {
  const html = sendPayerCompleteOrderTemplate(orderId, amount, token, method, name, submittedAt);

  sendEmail(email, EmailTitles.CompleteOrder, html);
};

export const sendUserCompleteOrderEmail = (
  email: string,
  orderId: string,
  payer: string,
  amount: string,
  token: string,
  method: string,
  name: string,
  submittedAt: string,
) => {
  const html = sendUserCompleteOrderTemplate(
    orderId,
    payer,
    amount,
    token,
    method,
    name,
    submittedAt,
  );

  sendEmail(email, EmailTitles.CompleteOrder, html);
};
