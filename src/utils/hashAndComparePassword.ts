import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePassword = (
  enteredPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isValid = bcrypt.compare(enteredPassword, hashedPassword);

  return isValid;
};
