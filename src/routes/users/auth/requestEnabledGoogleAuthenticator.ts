import { RequestHandler } from 'express';

import User, { IUser } from '../../../models/User';
import generateSecretKey from '../../../utils/google/generateSecretKey';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';
import generateQrCode from '../../../utils/google/generateQrCode';

const requestEnabledGoogleAuthenticatorHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (user.googleSecretKey) {
      return res.status(400).j({
        message: 'User already secret key google authenticator',
      });
    }

    const secretKey = generateSecretKey(user.name);

    const qrcode = await generateQrCode(secretKey);

    user.googleSecretKey = secretKey.base32;

    await user.save();

    return res.status(200).j({
      message: 'Send request enable google authenticator successfully',
      result: {
        secretKey: user.googleSecretKey,
        qrcode,
      },
    });
  },
];

export default requestEnabledGoogleAuthenticatorHandler;
