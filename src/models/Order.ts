import { Schema, model } from 'mongoose';

interface IProduct {
  name: string;
  logo: string;
  amount: string;
}

interface IOrder {
  user: Schema.Types.ObjectId;
  apiKey: Schema.Types.ObjectId;
  products: IProduct;
}

const Order = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apiKey: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
  products: [
    {
      name: { type: String, required: true },
      logo: { type: String, required: true },
      amount: { type: String, required: true },
    },
  ],
});

export default model<IOrder>('Order', Order);
