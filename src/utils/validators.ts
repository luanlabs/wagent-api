import validator from 'validator';
import { StrKey } from '@stellar/stellar-sdk';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validAddress = (address: string): boolean => {
  return StrKey.isValidEd25519PublicKey(address);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
