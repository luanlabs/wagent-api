import { Types } from 'mongoose';

import UserToken from '../models/UserToken';

const getUserTokens = async (userId: Types.ObjectId) => {
  const userTokens = await UserToken.find({ user: userId }).populate('token').exec();

  return userTokens.map((userToken) => userToken.token);
};

export default getUserTokens;
