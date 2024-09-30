import { Document, Schema, model } from 'mongoose';

import { MethodsNumerical } from '../utils/Method';
import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';

export interface IToken {
  symbol: string;
}

export interface IUser extends Document {
  name: string;
  logo?: string;
  email: string;
  apiKey: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
  isSubscribed: boolean;
  methods: MethodsNumerical;
  verificationToken?: string;
  verificationTokenExpiration?: number;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: number;
  subscribeToken: string;
  minimumCancellableStreamDuration: number;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  notificationTokens: string[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    isSubscribed: { type: Boolean, required: true, default: true },
    methods: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], default: 1 },
    verificationToken: { type: String, required: false },
    verificationTokenExpiration: { type: Number, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordTokenExpiration: { type: Number, required: false },
    subscribeToken: { type: String, required: true },
    minimumCancellableStreamDuration: { type: Number, required: true },
    notificationTokens: [{ type: String }],
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.email = this.email.toLowerCase();

  this.password = await hashPassword(this.password);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  const isValid = await comparePassword(enteredPassword, this.password);

  return isValid;
};

export default model<IUser>('User', UserSchema);
