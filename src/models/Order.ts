import { Schema, model } from 'mongoose';

interface IOrder {
  user: Schema.Types.ObjectId;
  apiKey: Schema.Types.ObjectId;
}

const Order = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apiKey: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
});

export default model<IOrder>('Order', Order);
