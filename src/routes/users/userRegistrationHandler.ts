import { RequestHandler } from 'express';

import User from '../../models/User';
import generateToken from '../../utils/generateToken';
import generateApiKey from "../../utils/generateApiKey";
import { sendVerificationEmail, sendRegistrationEmail } from '../../utils/emailService';
import registerValidationMiddleware from '../../middlewares/registerValidationMiddleware';

const userRegistrationHandler: RequestHandler[] = [
  registerValidationMiddleware,
  async (req, res) => {
    try {
      const { name, email, password, logoSrc } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User Already Exists!' });
      }

      const verificationToken = generateApiKey();

      const newUser = new User({
        email,
        password,
        verificationToken,
        isVerified: false,
        profile: {
          name,
          logoSrc,
        },
      });

      await newUser.save();

      sendRegistrationEmail(email);
      sendVerificationEmail(email, verificationToken);

      const token = generateToken(newUser.id);

      return res.status(201).json({
        result: {
          message: "Verification email was sent, please check your email.",
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
];

export default userRegistrationHandler;
