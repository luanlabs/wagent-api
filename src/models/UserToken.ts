import { Schema, model } from 'mongoose';

export interface IUserToken {
  user: Schema.Types.ObjectId;
  token: Schema.Types.ObjectId;
}

const UserToken = new Schema<IUserToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: Schema.Types.ObjectId, ref: 'Token', required: true },
});

export default model<IUserToken>('UserToken', UserToken);
