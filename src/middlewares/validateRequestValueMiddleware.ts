import { RequestHandler } from 'express';
import { z, ZodSchema } from 'zod';

interface ValidateOptions {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

const validateRequestValueMiddleware = (options: ValidateOptions) => {
  const middleware: RequestHandler = (req, res, next) => {
    try {
      if (options.body) {
        req.body = options.body.parse(req.body);
      }

      if (options.params) {
        req.params = options.params.parse(req.params);
      }

      if (options.query) {
        req.query = options.query.parse(req.query);
      }

      next();
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ error: e.errors[0].message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  return middleware;
};

export default validateRequestValueMiddleware;
