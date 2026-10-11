import User, { IUser } from '../models/User';
import randomString from './randomString';
import createDefaultUserTokens from './createDefaultUserTokens';
import { VerifiedBluxIdentity } from './blux';

const defaultStoreName = (identity: VerifiedBluxIdentity) => {
  const localPart = identity.email?.split('@')[0]?.trim();

  if (localPart && localPart.length >= 3) {
    return localPart.slice(0, 80);
  }

  const { address } = identity;
  return `Store ${address.slice(0, 4)}...${address.slice(-4)}`;
};

export class BluxUserConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BluxUserConflictError';
  }
}

const duplicateField = (error: unknown) => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  if ((error as { code: number }).code !== 11000) {
    return undefined;
  }

  const keyPattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
  return keyPattern ? Object.keys(keyPattern)[0] : undefined;
};

const saveUser = async (user: IUser) => {
  try {
    await user.save();
  } catch (error) {
    if (duplicateField(error) !== 'email' || !user.email) {
      throw error;
    }

    user.email = undefined;
    await user.save();
  }
};

const applyIdentity = async (user: IUser, identity: VerifiedBluxIdentity) => {
  if (user.bluxUserId && user.bluxUserId !== identity.bluxUserId) {
    throw new BluxUserConflictError(
      'This Stellar address is already linked to another Blux account',
    );
  }

  const addressOwner = await User.findOne({
    address: identity.address,
    _id: { $ne: user._id },
  });

  if (addressOwner) {
    throw new BluxUserConflictError('This Stellar address is already linked to another account');
  }

  user.bluxUserId = identity.bluxUserId;
  user.address = identity.address;
  user.isVerified = true;

  if (identity.email && !user.email) {
    user.email = identity.email;
  }

  await saveUser(user);
};

export const syncBluxUser = async (
  identity: VerifiedBluxIdentity,
): Promise<{ user: IUser; created: boolean }> => {
  let user = await User.findOne({ bluxUserId: identity.bluxUserId });

  if (!user) {
    user = await User.findOne({ address: identity.address });
  }

  if (user) {
    await applyIdentity(user, identity);
    return { user, created: false };
  }

  const newUser = new User({
    name: defaultStoreName(identity),
    address: identity.address,
    bluxUserId: identity.bluxUserId,
    email: identity.email,
    apiKey: randomString(15),
    subscribeToken: randomString(),
    isAdmin: false,
    isVerified: true,
    isSubscribed: true,
    methods: 1,
    minimumCancellableStreamDuration: 0,
    isAuthenticatorEnable: false,
  });

  try {
    await saveUser(newUser);
  } catch (error) {
    const field = duplicateField(error);

    if (field !== 'address' && field !== 'bluxUserId') {
      throw error;
    }

    const existing =
      (await User.findOne({ bluxUserId: identity.bluxUserId })) ||
      (await User.findOne({ address: identity.address }));

    if (!existing) {
      throw error;
    }

    await applyIdentity(existing, identity);
    return { user: existing, created: false };
  }

  await createDefaultUserTokens(newUser._id);

  return { user: newUser, created: true };
};
