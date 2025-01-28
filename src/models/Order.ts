import { Schema, model } from 'mongoose';

import { FIFTEEN_MINUTES } from '../constants/dates';
import orderStatusToExpired from '../utils/orders/orderStatusToExpired';

export interface IProduct {
  name: string;
  logo?: string;
  count: number;
  amount: number;
}

export interface IOrder {
  initialAmount: string;
  amount: string;
  user: Schema.Types.ObjectId;
  currency: string;
  memo: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  expiredTimestamp: number;
  redirectUrl: string;
  payerEmail?: string;
  isTransfer: boolean;
  products?: IProduct[];
}

const Order = new Schema<IOrder>(
  {
    amount: { type: String, required: true },
    initialAmount: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memo: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired', 'cancelled'],
      required: true,
    },
    payerEmail: { type: String, required: false },
    expiredTimestamp: { type: Number, required: true },
    redirectUrl: { type: String, required: true },
    isTransfer: { type: Boolean, required: true, default: false },
    currency: { type: String, default: 'USD' },
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

Order.post('save', async function (order) {
  setTimeout(() => {
    orderStatusToExpired(order._id);
  }, FIFTEEN_MINUTES);
});

export default model<IOrder>('Order', Order);
