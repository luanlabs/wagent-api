import { ZodError, ZodSchema } from 'zod';
import { RequestHandler } from 'express';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

const validatorMiddleware = (options: ValidateOptions) => {
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

      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).j({ message: e.issues });
      }

      return next(e);
    }
  };

  return middleware;
};

export default validatorMiddleware;
