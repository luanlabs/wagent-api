import { Schema, model } from 'mongoose';

interface IApiKey {
  user: Schema.Types.ObjectId;
  key: string;
  status: 'active' | 'inactive';
}

const ApiKey = new Schema<IApiKey>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    key: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
  },
  { timestamps: true },
);

export default model<IApiKey>('ApiKey', ApiKey);
