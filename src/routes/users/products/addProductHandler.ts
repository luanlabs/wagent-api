import { RequestHandler } from 'express';

const addProductHandler: RequestHandler = (req, res) => {
  return res.status(201).j({
    result: {
      success: true,
    },
  });
};

export default addProductHandler;
