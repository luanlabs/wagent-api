import { Schema, model, Types } from 'mongoose';

export interface IUserToken {
  user: Types.ObjectId;
  token: Types.ObjectId;
}

const UserToken = new Schema<IUserToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: Schema.Types.ObjectId, ref: 'Token', required: true },
});

export default model<IUserToken>('UserToken', UserToken);
