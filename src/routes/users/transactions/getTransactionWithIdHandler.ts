import { RequestHandler } from 'express';

const getTransactionWithIdHandler: RequestHandler = (req, res) => {
  return res.status(200).j({
    result: [
      {
        id: '2',
        productName: 'Mobile',
        method: 'stream',
        status: 'active',
        sender: 'GBUQL63MMQZL37NBVRHFG3L24PYMK6TYC6I44BR5KK52J5JZTKJA2KRJ',
        createdAt: '2024-07-04T13:39:37.379+00:00',
        cancelableAfter: '14400',
        progress: 65,
        amount: 23,
        token: 'usdt',
      },
    ],
  });
};

export default getTransactionWithIdHandler;
