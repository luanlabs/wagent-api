import { Schema, model } from 'mongoose';

export interface IOrdersToken {
  order: Schema.Types.ObjectId;
  token: Schema.Types.ObjectId;
  amount: string;
}

const OrdersToken = new Schema<IOrdersToken>({
  order: { type: String, required: true, ref: 'Order' },
  token: { type: String, required: true, ref: 'Token' },
  amount: { type: String, required: true },
});

export default model<IOrdersToken>('OrdersToken', OrdersToken);
