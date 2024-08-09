import { RequestHandler } from 'express';

import User from '../../models/User';
import generateToken from '../../utils/generateToken';
import generateApiKey from "../../utils/generateApiKey";
import { sendVerificationEmail,sendRegistrationEmail } from '../../utils/emailService';
import registerValidationMiddleware from '../../middlewares/registerValidationMiddleware';

const userRegistrationHandler: RequestHandler[] = [
  registerValidationMiddleware,
  async (req, res) => {
    const { storeName, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).j({ message: 'User Already Exist!' });
    }

    const verificationToken = generateApiKey();

    const newUser = new User({ storeName, email, password, verificationToken, isVerified: false });
    await newUser.save();

    sendRegistrationEmail(email);
    sendVerificationEmail(email, verificationToken);

    const token = generateToken(newUser.id);

    return res.status(201).j({
      result: {
        message: "Verification email was sent, please check your email."
      },
    });
  },
];

export default userRegistrationHandler;
