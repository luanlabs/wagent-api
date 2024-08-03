import nodemailer from 'nodemailer';

import logger from '../config/logger';
import getEnvs from '../config/getEnvs';
import emailTemplate from '../templates/emailTemplate';
import { EmailTitles } from '../constants/emailTitles';

const { EMAIL_USER, EMAIL_PASS } = getEnvs();

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
})

// const loadTemplate = (templateName: string, replacements: { [key: string]: string }): string => {
//   const templatePath = path.join(__dirname, '../templates', templateName);
//   let template = fs.readFileSync(templatePath, 'utf8');
//
//   for (const key in replacements) {
//     const placeholder = `{{${key}}}`;
//     template = template.replace(new RegExp(placeholder, 'g'), replacements[key]);
//   }
//
//   return template;
// };

export const sendRegistrationEmail = (email: string) => {
  // const htmlContent = loadTemplate('registrationTemplate.html', { email });
  //
  // const mailOptions = {
  //   from: EMAIL_USER,
  //   to: email,
  //   subject: 'Registration Successful',
  //   html: htmlContent,
  // };
  //
  // sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     logger.error('Error sending email: ' + error);
  //   } else {
  //     logger.info('Email sent: ' + info.response);
  //   }
  // });
};

export const sendVerificationEmail = (email: string, token: string) => {
  const options = {
    from: EMAIL_USER,
    to: email,
    subject: EmailTitles.Verification,
    /*
     * TODO: Pass the URL + /verify or whatever the route is to this function
     * To have the URL, add it to .env, .env.example, and getEnvs file. Do not use it directly
     * Like process.env.URL
     * Since the URL is similar to SWAGGER_API_URL, use that if you can.
     * Pass it like emailTemplate(verifyUrl) and change the emailTemplate filename, function name
     * and function body (to be more specific about email verification).
     *
     * TODO: Complete other functions like this one (sendResetPasswordEmail, etc..)
     * TODO: See why icons are not shown in the email content. Fix that if possible.
     * TODO: try to create a function just for transporter.sendMail because the code looks similar
     * in every function.
     * TODO: Test every route and email functionality.
     * 
     */
    html: emailTemplate(), // pass token or any other thing in here. A
  };
  
  transporter.sendMail(options, (error, _) => {
    if (error) {
      logger.error(`EMAIL: Failed to send verification code to ${email}`);
    } else {
      logger.info(`EMAIL: Verification code sent to ${email}`);
    }
  });
};

export const sendResetPasswordEmail = (email: string, token: string) => {
  // const htmlContent = loadTemplate('resetPasswordTemplate.html', { email, token, frontendUrl: process.env.FRONTEND_URL || '' });
  //
  // const mailOptions = {
  //   from: EMAIL_USER,
  //   to: email,
  //   subject: 'Password Reset',
  //   html: htmlContent,
  // };
  //
  // sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     logger.error('Error sending email: ' + error);
  //   } else {
  //     logger.info('Email sent: ' + info.response);
  //   }
  // });
};
