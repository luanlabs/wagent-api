import { RequestHandler } from 'express';

import generateToken from '../../utils/generateToken';
import User from '../../models/User';

const loginUserHandler: RequestHandler = async (req, res) => {
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
};

export default loginUserHandler;
