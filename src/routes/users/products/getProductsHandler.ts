import { RequestHandler } from 'express';

const getProductsHandler: RequestHandler = (req, res) => {
  return res.status(200).j({
    result: [
      {
        id: '5',
        name: 'Mobile',
        method: 'single',
        token: [{ symbol: 'USDT' }],
        amount: 25,
      },
    ],
  });
};

export default getProductsHandler;
