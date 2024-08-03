import { RequestHandler } from 'express';

import Tokens from '../../models/Tokens';

const getTokenHandler: RequestHandler = async (req, res) => {
  const tokens = await Tokens.find({ isActive: true })
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
