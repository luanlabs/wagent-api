import { RequestHandler } from 'express';

const deleteUserHandler: RequestHandler = async (req, res) => {
  return res.status(200).j({ result: { success: true } });
};

export default deleteUserHandler;
