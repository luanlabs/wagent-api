import { RequestHandler } from 'express';

import User from '../../models/User';
import generateToken from '../../utils/generateToken';
import loginValidationMiddleware from '../../middlewares/loginValidationMiddleware';

const userLoginHandler: RequestHandler[] = [
  loginValidationMiddleware,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: 'User does not exist',
        });
      }

      const isMatchPassword = await user.matchPassword(password);

      if (!isMatchPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      return res.status(200).json({
        result: {
          id: user.id,
          email: user.email,
          storeName: user.profile?.name,
          storeImage: user.profile?.logoSrc,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
];

export default userLoginHandler;
