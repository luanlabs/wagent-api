import envs from '../config/envs';

export enum EmailTitles {
  Verification = 'Wagent - Verify your email!',
  Registration = 'Wagent - Thank you for signing in',
  ResetPassword = 'Wagent - Reset your password',
  ResetPasswordSuccess = 'Wagent - Password has been reset',
  CompleteOrder = 'Wagent - Your order is complete',
}

export enum SocialMediaLinks {
  X = 'https://x.com/wagent',
  Github = 'https://github.com/luanlabs/wagent-interface',
  Discord = 'https://discord.com/invite/wagent',
}

const { FRONTEND_URL } = envs();

export const unsubscribeLink = `${FRONTEND_URL}/unsubscribe`;
