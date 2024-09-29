import validator from 'validator';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validAddress = (address: string): boolean => {
  return StrKey.isValidED55219PublicKey(address);
};
