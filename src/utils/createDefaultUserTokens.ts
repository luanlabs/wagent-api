import log from '../config/logger';
import Token from '../models/Token';
import UserToken from '../models/UserToken';
import { Types } from 'mongoose';

const createDefaultUserTokens = async (userId: Types.ObjectId) => {
  try {
    const tokens = await Token.find();

    if (tokens.length === 0) {
      return;
    }

    await UserToken.insertMany(
      tokens.map((token) => ({
        user: userId,
        token: token._id,
      })),
    );
  } catch (e) {
    // A user can still use the account without pre-seeded tokens,
    // so this is logged but not treated as a login/registration failure.
    log.error(`USER: Failed to create default user tokens - ${e}`);
  }
};

export default createDefaultUserTokens;
