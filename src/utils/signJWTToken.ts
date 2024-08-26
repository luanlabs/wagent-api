import jwt from 'jsonwebtoken';
import getEnvs from '../config/getEnvs';

const signJWTToken = (id: string) => {
  const { JWT_SECRET } = getEnvs();

  return jwt.sign({ id }, JWT_SECRET as string, { expiresIn: '30d' });
};

export default signJWTToken;
