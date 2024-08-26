import { RequestHandler } from 'express';

const addProductHandler: RequestHandler = (req, res) => {
  return res.status(201).j({
    message: 'TODO',
    result: {
      success: true,
    },
  });
};

export default addProductHandler;
