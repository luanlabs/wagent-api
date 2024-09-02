import { RequestHandler } from 'express';

import Token from '../../models/Token';

const getTokenHandler: RequestHandler = async (_, res) => {
  const tokens = await Token.find();

  return res.status(200).j({
    message: 'Tokens',
    result: tokens,
  });
};

export default getTokenHandler;
