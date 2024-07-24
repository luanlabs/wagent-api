import mongoose, { Schema, model } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

interface IOrder {
  id: number;
  user: Schema.Types.ObjectId;
  // TODO: api_key foreign key
  api_key: string;
}

const Order = new Schema<IOrder>({
  id: { type: Number, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  api_key: { type: String, required: true },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoIncrement: any = AutoIncrementFactory(mongoose);

Order.plugin(AutoIncrement, { inc_field: 'id' });

export default model<IOrder>('Order', Order);
