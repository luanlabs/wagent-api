import { Schema, model } from 'mongoose';

import { FIFTEEN_MINUTES } from '../constants/dates';
import orderStatusToExpired from '../utils/orders/orderStatusToExpired';

export interface IProduct {
  name: string;
  logo?: string;
  count: number;
  amount: number;
}

interface IOrder {
  amount: string;
  user: Schema.Types.ObjectId;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  expiredTimestamp: number;
  redirectUrl: string;
  products?: IProduct[];
}

const Order = new Schema<IOrder>(
  {
    amount: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired', 'cancelled'],
      required: true,
    },
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

Order.post('save', async function (order) {
  setTimeout(() => {
    orderStatusToExpired(order._id);
  }, FIFTEEN_MINUTES);
});

export default model<IOrder>('Order', Order);
