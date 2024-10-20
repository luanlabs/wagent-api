import { model, Schema } from 'mongoose';

interface ICurrency {
  name: string;
  rate: number;
}

const Currency = new Schema<ICurrency>(
  {
    name: { type: String, required: true },
    rate: { type: Number, required: true },
  },
  { timestamps: true },
);

export default model<ICurrency>('Currency', Currency);
