import { Schema, model } from 'mongoose';

interface ITransaction {
  hash: string;
  method: string;
  payerEmail: string;
  submittedAt: string;
  payerAddress: string;
  order: Schema.Types.ObjectId;
  token: Schema.Types.ObjectId;
}

const Transaction = new Schema<ITransaction>({
  payerEmail: { type: String },
  method: { type: String, required: true },
  submittedAt: { type: String, required: true },
  payerAddress: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  token: { type: Schema.Types.ObjectId, ref: 'Token', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
});

export default model<ITransaction>('Transaction', Transaction);
