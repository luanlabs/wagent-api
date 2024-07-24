import { Schema, model } from 'mongoose';
interface IOrder {
  user: Schema.Types.ObjectId;
  // TODO: api_key foreign key
  apiKey: string;
}

const Order = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apiKey: { type: String, required: true },
});

export default model<IOrder>('Order', Order);
