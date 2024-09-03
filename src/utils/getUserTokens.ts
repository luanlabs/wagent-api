import mongoose from 'mongoose';
import UserToken from '../models/UserToken';
import Token, { IToken } from '../models/Token';

const getUserTokens = async (userId: mongoose.Schema.Types.ObjectId) => {
  const userTokens = await UserToken.find({ user: userId }).populate('token').exec();

  const tokens: IToken[] = [];

  for (let i = 0; i < userTokens.length; i++) {
    const token = await Token.findById(userTokens[i].token);
    if (token) {
      tokens.push(token);
    }
  }

  return tokens;
};

export default getUserTokens;
