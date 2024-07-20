import { RequestHandler } from 'express';

const editUserProfileHandler: RequestHandler = async (req, res) => {
  return res.status(200).j({
    result: {
      methods: ['single'],
      minDuration: 68400,
      tokens: [{ symbol: 'USDT' }],
    },
  });
};

export default editUserProfileHandler;
