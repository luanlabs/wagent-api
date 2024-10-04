import Order from '../../models/Order';

const ordersStatusToExpired = async () => {
  const currentTime = Date.now();

  const orders = await Order.find({ expiredTimestamp: { $lt: currentTime }, status: 'pending' });

  for (const order of orders) {
    order.status = 'expired';
    order.save();
  }
};

export default ordersStatusToExpired;
