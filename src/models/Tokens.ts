import { Schema, model } from 'mongoose';

interface IToken {
  symbol: string;
  logo: string;
}

const Token = new Schema<IToken>({
  symbol: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
});

export default model<IToken>('Token', Token);
