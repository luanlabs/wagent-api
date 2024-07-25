import ApiKey from '../models/ApiKey';
import { IUser } from '../models/User';
import generateApiKey from './generateApiKey';

const updateApiKey = async (user: IUser) => {
  await ApiKey.updateMany({ user, isActive: true }, { $set: { isActive: false } });

  const apiKey = generateApiKey();

  const newApiKey = new ApiKey({
    user: user._id,
    key: apiKey,
    isActive: true,
  });

  await newApiKey.save();
};

export default updateApiKey;
