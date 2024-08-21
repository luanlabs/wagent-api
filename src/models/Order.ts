import { Schema, model } from 'mongoose';

interface IProduct {
  name: string;
  logo: string;
  amount: string;
}

interface IOrder {
  user: Schema.Types.ObjectId;
  status: boolean;
  products: IProduct[];
}

const Order = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Boolean, required: true },
    products: [
      {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

export default model<IOrder>('Order', Order);
