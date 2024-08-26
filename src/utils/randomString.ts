import crypto from 'crypto';

const randomString = () => {
  return crypto.randomBytes(32).toString('hex');
};

export default randomString;
