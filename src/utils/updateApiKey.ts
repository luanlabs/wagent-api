import ApiKey from '../models/ApiKey';
import { IUser } from '../models/User';
import generateApiKey from './generateApiKey';

const updateApiKey = async (user: IUser) => {
  await ApiKey.deleteMany({ user });

  const apiKey = generateApiKey();

  const newApiKey = new ApiKey({
    user: user._id,
    key: apiKey,
  });

  await newApiKey.save();
};

export default updateApiKey;
