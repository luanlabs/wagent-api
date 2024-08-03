import { createTransport } from 'nodemailer';
import fs from 'fs';
import path from 'path';

import logger from '../config/logger';
import getEnvs from '../config/getEnvs';

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

const loadTemplate = (templateName: string, replacements: { [key: string]: string }): string => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  let template = fs.readFileSync(templatePath, 'utf8');

  for (const key in replacements) {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), replacements[key]);
  }

  return template;
};

export const sendRegistrationEmail = (email: string) => {
  const htmlContent = loadTemplate('registrationTemplate.html', { email });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Registration Successful',
    html: htmlContent,
  };

  sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email: ' + error);
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};

export const sendVerificationEmail = (email: string, token: string) => {
  const htmlContent = loadTemplate('verificationTemplate.html', { email, token, frontendUrl: process.env.FRONTEND_URL || '' });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: htmlContent,
  };

  sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email: ' + error);
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};

export const sendResetPasswordEmail = (email: string, token: string) => {
  const htmlContent = loadTemplate('resetPasswordTemplate.html', { email, token, frontendUrl: process.env.FRONTEND_URL || '' });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: htmlContent,
  };

  sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email: ' + error);
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};