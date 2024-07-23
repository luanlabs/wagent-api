import { RequestHandler } from 'express';

const verifyJwtTokenHandler: RequestHandler = (req, res) => {
  return res.status(200).j({
    result: { valid: true },
  });
};

export default verifyJwtTokenHandler;
