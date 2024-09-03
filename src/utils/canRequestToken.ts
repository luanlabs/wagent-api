import { FIVE_MINUTES, ONE_DAY } from '../constants/Dates';

const canRequestToken = (tokenExpirationTimestamp?: number): boolean => {
  if (!tokenExpirationTimestamp) {
    return true;
  }

  const currentTime = Date.now();
  const lastTokenSentTimestamp = tokenExpirationTimestamp - ONE_DAY;

  return currentTime > lastTokenSentTimestamp + FIVE_MINUTES;
};

export default canRequestToken;
