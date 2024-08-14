import { Schema, model } from 'mongoose';

interface IProduct {
  name: string;
  logo: string;
  amount: string;
}

interface IOrder {
  user: Schema.Types.ObjectId;
  products: IProduct[];
  callback: string;
  link2: string;
}

const Order = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    callback: { type: String, required: true },
    link2: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<IOrder>('Order', Order);
