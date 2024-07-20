import { RequestHandler } from 'express';

const getOrderByIdHandler: RequestHandler = (_, res) => {
  return res.status(200).j({
    result: {
      id: '20',
      amount: '1000',
      merchant: {
        methods: ['single', 'stream'],
        tokens: [{ symbol: 'USDT' }, { symbol: 'USDC' }],
      },
      products: [
        {
          id: '5',
          name: 'Mobile',
          amount: '25',
        },
      ],
    },
  });
};

export default getOrderByIdHandler;
