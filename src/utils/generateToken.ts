import jwt from 'jsonwebtoken';
import getEnvs from '../config/getEnvs';

const generateToken = (id: string) => {
  const { JWT_SECRET } = getEnvs();

  return jwt.sign({ id }, JWT_SECRET as string, { expiresIn: '1h' });
};

export default generateToken;
