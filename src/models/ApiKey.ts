import { Schema, model } from 'mongoose';

interface IApiKey {
  user: Schema.Types.ObjectId;
  key: string;
  isActive: boolean;
}

const ApiKey = new Schema<IApiKey>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true },
});

export default model<IApiKey>('ApiKey', ApiKey);
