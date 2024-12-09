import { Schema, model } from 'mongoose';

export interface IOrderToken {
  order: Schema.Types.ObjectId;
  token: Schema.Types.ObjectId;
  amount: string;
  initialAmount: string;
}

const OrderToken = new Schema<IOrderToken>({
  order: { type: String, required: true, ref: 'Order' },
  token: { type: String, required: true, ref: 'Token' },
  amount: { type: String, required: true },
  initialAmount: { type: String, required: true },
});

export default model<IOrderToken>('OrderToken', OrderToken);
