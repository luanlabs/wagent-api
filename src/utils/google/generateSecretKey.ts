import speakeasy from 'speakeasy';

const generateSecretKey = (name: string) => {
  const secretKey = speakeasy.generateSecret({
    length: 32,
    name: `Wagent: ${name}`,
    google_auth_qr: true,
  });

  return secretKey;
};

export default generateSecretKey;
