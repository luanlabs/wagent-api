import Order from '../../models/Order';
import orderStatusToExpired from './orderStatusToExpired';

const ordersStatusToExpired = async () => {
  const currentTime = Date.now();

  const orders = await Order.find({ expiredTimestamp: { $lt: currentTime }, status: 'pending' });

  for (const order of orders) {
    orderStatusToExpired(order._id);
  }
};

export default ordersStatusToExpired;
