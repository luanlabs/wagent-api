import { RequestHandler } from 'express';
import { z } from 'zod';

const editTokenSchemaParams = z.object({
  symbol: z.string({
    required_error: 'symbol is required',
    invalid_type_error: 'symbol must be a string',
  }),
});

const editTokenSchemaBody = z.object({
  logo: z.string({
    required_error: 'logo is required',
    invalid_type_error: 'logo must be a string',
  }),
});

const editTokenMiddleware: RequestHandler = (req, res, next) => {
  const resultBody = editTokenSchemaBody.safeParse(req.body);
  const resultParams = editTokenSchemaParams.safeParse(req.params);

  if (resultBody.error) {
    return res.status(400).j({ message: resultBody.error.errors });
  }

  if (resultParams.error) {
    return res.status(400).j({ message: resultParams.error.errors });
  }

  next();
};

export default editTokenMiddleware;
