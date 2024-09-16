import { Schema, model } from 'mongoose';

export interface IProduct {
  name: string;
  logo?: string;
  count: number;
  amount: number;
}

interface IOrder {
  amount: string;
  user: Schema.Types.ObjectId;
  status: 'pending' | 'completed' | 'expired';
  expiredTimestamp: number;
  redirectUrl: string;
  products?: IProduct[];
}

const Order = new Schema<IOrder>(
  {
    amount: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed', 'expired'], required: true },
    expiredTimestamp: { type: Number, required: true },
    redirectUrl: { type: String, required: true },
    products: [
      {
        type: {
          name: { type: String, required: true },
          logo: { type: String, required: false },
          count: { type: Number, required: true },
          amount: { type: String, required: true },
        },
        required: false,
      },
    ],
  },
  { timestamps: true },
);

export default model<IOrder>('Order', Order);
