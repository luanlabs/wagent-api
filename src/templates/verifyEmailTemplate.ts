import { SocialMediaLinks } from '../constants/emailValues';

const verifyEmailTemplate = (name: string, verifyUrl: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Aeonik, sans-serif; margin: 0; padding: 5px; background-color: #f4f4f4;">
<div style="max-width: 152px;margin: 0 auto;">
    <img src="https://static.wagent.app/icons/wagent.png" style="margin-top: 30px;width: 147px;height: 29px;" alt="">
</div>
<div style="max-width: 600px; margin: 0 auto;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 30px; overflow: hidden;">
        <div style="background-color: #073834; color: #ffffff; text-align: center;height: 155px;">
            <img src="https://static.wagent.app/icons/header.png" style="height: 106%;width: 91%;" alt="">
        </div>
        <div style="padding: 20px;padding-bottom: 40px;background-color: white;z-index: 9;position: relative;">
            <p style="color: #003C31; font-size: 24px; line-height: 1.5;">Dear ${name},</p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">To complete your registration,
                please click the button below to verify your email address.</p>
            <a href="${verifyUrl}" target="_blank" style="
            display: inline-block;
            background-color: #073834;
            color: white;
            padding: 15px 28px;
            margin-top: 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        ">Verify Email</a>
        </div>

    </div>
    <div style="text-align: left; color: #999999; font-size: 12px;">
        <p>You received this email because you just signed up for a new account.</p>
        <div style="margin-top: 56px">
            <a href="${SocialMediaLinks.X}" style="margin-right: 10px;width: 17px;height: 17px;">
                <img src="https://static.wagent.app/icons/x.png" alt="">
            </a>
            <a href="${SocialMediaLinks.Github}" style="margin-right: 10px;width: 17px;height: 17px;">
                <img src="https://static.wagent.app/icons/github.png" alt="">
            </a>
            <a href="${SocialMediaLinks.Discord}" style="margin-right: 10px;width: 17px;height: 17px;">
                <img src="https://static.wagent.app/icons/discord.png" alt="">
            </a>
        </div>
        <p>Copyright © 2024</p>
    </div>
</div>
</body>
</html>
  `;
};

export default verifyEmailTemplate;
