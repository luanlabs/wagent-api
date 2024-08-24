import { Document, Schema, model } from 'mongoose';

import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';
import { MethodsType } from '../utils/Method';

export interface IToken {
  symbol: string;
}

export interface ISettings {
  methods: MethodsType[];
  minimumCancellableStreamDuration: number;
  tokens: IToken[];
  isSubscribed: boolean;
}

export interface IProfile {
  name: string;
  logoSrc: string;
}

export interface IUser extends Document {
  email: string;
  apiKey: string;
  password: string;
  storeName: string;
  storeImage: string;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiration?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  settings?: ISettings;
  profile?: IProfile;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    storeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    storeImage: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
    verificationTokenExpiration: {
      type: Date,
      required: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    settings: {
      method: { type: String, enum: ['single', 'stream', 'vesting'], required: false },
      minDuration: { type: Number, required: false },
      tokens: [{ symbol: { type: String, required: true } }],
      emailNotif: { type: Boolean, required: false },
    },
    profile: {
      name: { type: String, required: false },
      logoSrc: { type: String, required: false },
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  const isValid = await comparePassword(enteredPassword, this.password);
  return isValid;
};

export default model<IUser>('User', UserSchema);
