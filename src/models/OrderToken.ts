import { Schema, model } from 'mongoose';

// `order` and `token` reference Order/Token documents but are stored as their
// hex-string ids (the schema paths below use `String`), so they are typed as
// strings to match what MongoDB actually persists.
export interface IOrderToken {
  order: string;
  token: string;
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
