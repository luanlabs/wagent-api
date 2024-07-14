import { RequestHandler } from 'express';

const getOrderAndPaymentUser: RequestHandler = (req, res) => {
  return res.status(200).j({
    result: {
      order: {
        id: '20',
        totalAmount: 1000,
        products: [
          {
            id: '5',
            name: 'Mobile',
            method: 'single',
            token: [{ symbol: 'USDT' }],
            amount: 25,
          },
        ],
      },
      paymentSuccess: true,
    },
  });
};

export default getOrderAndPaymentUser;
