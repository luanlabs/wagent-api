import { RequestHandler } from 'express';

const editProfileUserHandler: RequestHandler = async (req, res) => {
  return res.status(200).j({
    result: {
      settings: {
        method: 'single',
        minDuration: 1400,
        tokens: [{ symbol: 'USDT' }],
        emailNotif: true,
      },
      profile: {
        name: 'Jac',
        logoSrc: 'https://image.com',
      },
    },
  });
};

export default editProfileUserHandler;
