import { RequestHandler } from 'express';

const getTransactionsHandler: RequestHandler = (req, res) => {
  return res.status(200).j({
    result: [
      {
        id: '2',
        products: [
          {
            id: '5',
            name: 'Mobile',
            method: 'single',
            token: [{ symbol: 'USDT' }],
            amount: 25,
          },
        ],
        method: 'stream',
        status: 'active',
        createdAt: '2024-07-04T13:39:37.379+00:00',
        amount: 23,
        token: 'usdt',
      },
    ],
  });
};

export default getTransactionsHandler;
