import { ONE_HOUR, FIFTEEN_MINUTES } from '../constants/Dates';

const canRequestPasswordResetToken = (user: any): boolean => {
  const currentTime = Date.now();
  return !(user.resetPasswordTokenExpiration &&
    currentTime < user.resetPasswordTokenExpiration - (ONE_HOUR - FIFTEEN_MINUTES));
};

export default canRequestPasswordResetToken;