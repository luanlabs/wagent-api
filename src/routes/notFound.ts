import { RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (_, res, __) => {
  res.status(404).j({
    message: 'Not Found',
  });
};

export default notFoundHandler;
