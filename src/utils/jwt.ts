import jwt from 'jsonwebtoken';

import envs from '../config/envs';

const { JWT_SECRET } = envs();

export const sign = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const verify = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === 'object' && payload !== null && 'id' in payload) {
      return String((payload as { id: unknown }).id);
    }

    return null;
  } catch {
    return null;
  }
};
