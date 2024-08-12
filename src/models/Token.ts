import { Schema, model } from 'mongoose';

interface IToken {
  address?: string;
  symbol: string;
  logo: string;
  isActive?: boolean;
}

const Token = new Schema<IToken>({
  address: { type: String, required: false, unique: true },
  symbol: { type: String, required: true },
  logo: { type: String, required: true },
  isActive: { type: Boolean, required: false, default: true },
});

Token.index(
  { address: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

export default model<IToken>('Token', Token);
