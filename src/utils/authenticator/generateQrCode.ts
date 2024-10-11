import { toDataURL } from 'qrcode';
import { GeneratedSecret } from 'speakeasy';

const generateQrCode = async (secretKey: GeneratedSecret) => {
  const qr = await toDataURL(secretKey.otpauth_url!, { type: 'image/webp' });

  return qr;
};

export default generateQrCode;
