import { Types } from 'mongoose';
import Order from '../../models/Order';

const orderStatusToExpired = async (orderId: Types.ObjectId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    return undefined;
  }

  if (order.status === 'pending') {
    order.status = 'expired';

    order.save();
  }
};

export default orderStatusToExpired;
