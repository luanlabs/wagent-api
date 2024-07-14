import { RequestHandler } from 'express';

import User from '../../models/User';
import generateToken from '../../utils/generateToken';
import loginValidationMiddleware from '../../middlewares/loginValidationMiddleware';

const loginUserHandler: RequestHandler[] = [
  loginValidationMiddleware,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).j({
        message: 'User not exist',
      });
    }

    const isMathPassword = await user.matchPassword(password);

    if (!isMathPassword) {
      return res.status(400).j({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.j({
      result: {
        id: user.id,
        email: user.email,
        storeName: user.storeName,
        storeImage: user.storeImage,
        token,
      },
    });
  },
];

export default loginUserHandler;
