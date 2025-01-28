import speakeasy from 'speakeasy';

const verifyAuthenticatorToken = (secretKey: string, token: string) => {
  const verified = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token,
    window: 0,
  });

  return verified;
};

export default verifyAuthenticatorToken;
