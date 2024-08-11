import { z } from 'zod';
import { RequestHandler } from 'express';

import getEnvs from '../config/getEnvs';

const adminAuthSchema = z.object({
  authorization: z.string({
    required_error: 'authorization is required',
    invalid_type_error: 'authorization must be a string',
  }),
});

const adminAuthMIddleware: RequestHandler = (req, res, next) => {
  const result = adminAuthSchema.safeParse(req.header);

  const { ADMIN_PASSWORD } = getEnvs();

  if (result.error) {
    return res.status(400).j({ message: result.error.errors });
  }

  const { authorization } = result.data;

  if (authorization !== ADMIN_PASSWORD) {
    return res.status(403).json({
      status: 'error',
      message: 'Authorization failed',
      result: {},
    });
  }

  next();
};

export default adminAuthMIddleware;
