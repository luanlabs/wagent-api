import { Document, Schema, model } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/hashAndComparePassword';

export interface IUser extends Document {
  email: string;
  password: string;
  storeName: string;
  storeImage: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const User = new Schema<IUser>(
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
    password: {
      type: String,
      required: true,
    },
    storeImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

User.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

User.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  const isValid = await comparePassword(enteredPassword, this.password);
  return isValid;
};

export default model<IUser>('User', User);
