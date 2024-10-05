import speakeasy from 'speakeasy';

const verifyToken = (secretKey: string, token: string) => {
  const verified = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token,
    window: 0,
  });

  return verified;
};

export default verifyToken;
