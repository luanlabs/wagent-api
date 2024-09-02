import jwt from 'jsonwebtoken';

import envs from '../config/envs';

const { JWT_SECRET } = envs();

export const sign = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const verify = (token: string) => {
  try {
    // @ts-ignore
    return jwt.verify(token, JWT_SECRET).id;
  } catch (e) {
    return null;
  }
};
