import { Schema, model, Types } from 'mongoose';

export interface ITransaction {
  _id: Types.ObjectId;
  hash: string;
  successful: boolean;
  method: string;
  submittedAt: number;
  payerAddress: string;
  amount: string;
  order: Types.ObjectId;
  token: Types.ObjectId;
}

const Transaction = new Schema<ITransaction>(
  {
    submittedAt: { type: Number, required: true },
    method: { type: String, required: true, enum: ['single', 'stream', 'vesting'] },
    payerAddress: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
    successful: { type: Boolean, required: true },
    amount: { type: String, required: true },
    token: { type: Schema.Types.ObjectId, ref: 'Token', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  },
  {
    timestamps: true,
  },
);

export default model<ITransaction>('Transaction', Transaction);
