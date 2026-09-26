import { Document, Schema, model } from 'mongoose';

import { MethodsNumerical } from '../utils/Method';
import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';

export interface IToken {
  symbol: string;
}

export interface IUser extends Document {
  name: string;
  logo?: string;
  email?: string;
  apiKey: string;
  /** Stellar G address assigned by Blux. Merchants do not choose it. */
  address: string;
  /** Blux project user id. Authenticated requests are checked against this id. */
  bluxUserId?: number;
  password?: string;
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
  authenticatorSecretKey?: string;
  isAuthenticatorEnable?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: false },
    address: { type: String, required: true, unique: true },
    bluxUserId: { type: Number, unique: true, sparse: true },
    email: { type: String, required: false, unique: true, sparse: true },
    apiKey: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, required: false, default: false },
    isVerified: { type: Boolean, required: true, default: true },
    isSubscribed: { type: Boolean, required: true, default: true },
    methods: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], default: 1 },
    verificationToken: { type: String, required: false },
    verificationTokenExpiration: { type: Number, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordTokenExpiration: { type: Number, required: false },
    subscribeToken: { type: String, required: true },
    minimumCancellableStreamDuration: { type: Number, required: true },
    notificationTokens: [{ type: String }],
    authenticatorSecretKey: { type: String, required: false },
    isAuthenticatorEnable: { type: Boolean, required: false },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function () {
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase();
  }

  if (this.isModified('password') && this.password) {
    this.password = await hashPassword(this.password);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return comparePassword(enteredPassword, this.password);
};

export default model<IUser>('User', UserSchema);
