import mongoose from 'mongoose';
import User from '../models/User';

const getUserSubscribeToken = async (userId: mongoose.Schema.Types.ObjectId) => {
  const user = await User.findById(userId);

  return user?.subscribeToken;
};

export default getUserSubscribeToken;
