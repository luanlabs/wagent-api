import { Schema, model } from 'mongoose';

export interface IToken {
  logo: string;
  symbol: string;
  address: string;
}

const Token = new Schema<IToken>({
  logo: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
});

export default model<IToken>('Token', Token);
