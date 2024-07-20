import { RequestHandler } from 'express';

const createNewOrderHandler: RequestHandler = (req, res) => {
  // const {  } = req.body;

  return res.status(200).j({
    result: {
      id: '20',
    },
  });
};

export default createNewOrderHandler;
