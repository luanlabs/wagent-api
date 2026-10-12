import { FIVE_MINUTES, ONE_HOUR } from '../constants/dates';

const canRequestToken = (tokenExpirationTimestamp?: number): boolean => {
  if (!tokenExpirationTimestamp) {
    return true;
  }

  const currentTime = Date.now();
  const lastTokenSentTimestamp = tokenExpirationTimestamp - ONE_HOUR;

  return currentTime > lastTokenSentTimestamp + FIVE_MINUTES;
};

export default canRequestToken;
