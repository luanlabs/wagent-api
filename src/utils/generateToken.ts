import randomString from './randomString';
import { ONE_HOUR } from '../constants/Dates';

const generateToken = () => {
  return {
    token: randomString(),
    expiration: Date.now() + ONE_HOUR,
  };
};

export default generateToken;
