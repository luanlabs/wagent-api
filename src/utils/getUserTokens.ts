import mongoose from 'mongoose';

import UserToken from '../models/UserToken';

const getUserTokens = async (userId: mongoose.Schema.Types.ObjectId) => {
  const userTokens = await UserToken.find({ user: userId }).populate('token').exec();

  return userTokens.map((userToken) => userToken.token);
};

export default getUserTokens;
