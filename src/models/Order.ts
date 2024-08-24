import { Schema, model } from 'mongoose';

export interface IProduct {
  name: string;
  logo: string;
  count: number;
  amount: string;
}

interface IOrder {
  user: Schema.Types.ObjectId;
  products?: IProduct[];
  amount?: string;
  status: 'pending' | 'completed' | 'expired';
  redirectUrl: string;
}

const Order = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed', 'expired'], required: true },
    products: [
      {
        type: {
          name: { type: String, required: true },
          logo: { type: String, required: true },
          count: { type: Number, required: true },
          amount: { type: String, required: true },
        },
        required: false,
      },
    ],
    amount: { type: String, required: false },
    redirectUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<IOrder>('Order', Order);
