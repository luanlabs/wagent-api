import { RequestHandler } from 'express';

import User, { IUser } from '../../../models/User';
import generateSecretKey from '../../../utils/authenticator/generateSecretKey';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';
import generateQrCode from '../../../utils/authenticator/generateQrCode';

const requestEnabledAuthenticatorHandler: RequestHandler[] = [
  authorizationMiddleware,
  async (req, res) => {
    const reqUser = req.user as IUser;
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).j({
        message: 'User not found',
      });
    }

    if (user.isAuthenticatorEnable) {
      return res.status(400).j({
        message: 'User already enabled authenticator',
      });
    }

    const secretKey = generateSecretKey(user.name);

    const qrcode = await generateQrCode(secretKey);

    user.authenticatorSecretKey = secretKey.base32;

    await user.save();

    return res.status(200).j({
      message: 'Send request enable Authenticator successfully',
      result: {
        secretKey: user.authenticatorSecretKey,
        qrcode,
      },
    });
  },
];

export default requestEnabledAuthenticatorHandler;
