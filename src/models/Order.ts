import { Schema, model } from 'mongoose';

interface IOrder {
  user: Schema.Types.ObjectId;
  apiKey: Schema.Types.ObjectId;
}

const Order = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apiKey: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
});

const removeVersionKeyPlugin = (schema: Schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  });
  schema.set('toObject', {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  });
};

Order.plugin(removeVersionKeyPlugin);

export default model<IOrder>('Order', Order);
