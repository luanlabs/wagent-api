import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

import logger from '../config/logger';
import getEnvs from '../config/getEnvs';
import verifyEmailTemplate from '../templates/verifyEmailTemplate';
import { EmailTitles } from '../constants/emailTitles';

const { EMAIL_USER, EMAIL_PASS, VERIFY_URL, FRONTEND_URL } = getEnvs();

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

const loadTemplate = (templateName: string, replacements: { [key: string]: string }): string => {
    const templatePath = path.join(__dirname, '../templates', templateName);
    let template = fs.readFileSync(templatePath, 'utf8');

    for (const key in replacements) {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), replacements[key]);
    }

    return template;
};

export const sendRegistrationEmail = (email: string): void => {
    const htmlContent = loadTemplate('registrationTemplate.ts', { email });
    sendEmail(email, 'Registration Successful', htmlContent);
};

export const sendVerificationEmail = (email: string, token: string): void => {
    const verifyUrl = `${VERIFY_URL}?token=${token}`;
    const htmlContent = verifyEmailTemplate(verifyUrl);
    sendEmail(email, EmailTitles.Verification, htmlContent);
};

export const sendResetPasswordEmail = (email: string, token: string): void => {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
    const htmlContent = loadTemplate('resetPasswordTemplate.ts', { email, token, resetUrl });
    sendEmail(email, 'Password Reset', htmlContent);
};