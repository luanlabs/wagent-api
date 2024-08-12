import { Schema, model } from 'mongoose';

interface ITransaction {
  hash: string;
  payerAddress: string;
  order: Schema.Types.ObjectId;
  method: string;
  token: Schema.Types.ObjectId;
  submittedAt: string;
}

const Transaction = new Schema<ITransaction>({
  hash: { type: String, required: true, unique: true },
  payerAddress: { type: String, required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  method: { type: String, required: true },
  token: { type: Schema.Types.ObjectId, ref: 'Token', required: true },
  submittedAt: { type: String, required: true },
});

export default model<ITransaction>('Transaction', Transaction);
