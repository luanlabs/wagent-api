import { Document, Schema, model } from 'mongoose';

import { MethodsNumerical } from '../utils/Method';
import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';

export interface IToken {
  symbol: string;
}

export interface ISettings {
  methods: number;
  minimumCancellableStreamDuration: number;
  tokens: IToken[];
  isSubscribed: boolean;
}

export interface IUser extends Document {
  name: string;
  logo: string;
  email: string;
  apiKey: string;
  password: string;
  isAdmin?: boolean;
  isVerified: boolean;
  tokens: IToken[];
  isSubscribed: boolean;
  methods: MethodsNumerical;
  settings?: ISettings;
  verificationToken?: string;
  verificationTokenExpiration?: number;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: number;
  minimumCancellableStreamDuration: number;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
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
    settings: {
      methods: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], default: 1, required: true },
      minimumCancellableStreamDuration: { type: Number, required: false },
      tokens: [{ symbol: { type: String, required: true } }],
      isSubscribed: { type: Boolean, required: false },
    },
    tokens: [{ symbol: { type: String, required: true } }],
    isSubscribed: { type: Boolean, required: true },
    methods: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], default: 1 },
    logo: String,
    isAdmin: Boolean,
    isVerified: Boolean,
    verificationToken: String,
    verificationTokenExpiration: Number,
    resetPasswordToken: String,
    resetPasswordTokenExpiration: Number,
    minimumCancellableStreamDuration: Number,
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
