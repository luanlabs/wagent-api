import crypto from 'crypto';

const randomString = (num?: number) => {
  return crypto.randomBytes(num || 32).toString('hex');
};

export default randomString;
