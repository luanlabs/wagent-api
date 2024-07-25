import ApiKey from '../models/ApiKey';
import { IUser } from '../models/User';
import generateApiKey from './generateApiKey';

const updateApiKey = async (user: IUser) => {
  await ApiKey.updateMany({ user, status: 'active' }, { $set: { status: 'inactive' } });

  const apiKey = generateApiKey();

  const newApiKey = new ApiKey({
    user: user._id,
    key: apiKey,
    status: 'active',
  });

  await newApiKey.save();
};

export default updateApiKey;
