import { RequestHandler } from 'express';

import Token from '../../models/Token';

const getTokenHandler: RequestHandler = async (_, res) => {
  const tokens = await Token.find({ isActive: true })
    .collation({ locale: 'en' })
    .sort({ symbol: 1 })
    .exec();

  if (!tokens.length) {
    return res.status(400).j({
      message: 'No token has been added.',
    });
  }

  return res.status(200).j({
    result: tokens,
  });
};

export default getTokenHandler;
