import { RequestHandler } from 'express';

interface ICustomResponse {
  message: object | string;
  result?: object | string;
  error?: {
    message: string;
    extras?: unknown;
  };
}

declare module 'express-serve-static-core' {
  interface Response {
    /**
     * Send a JSON response using the API's standard envelope.
     *
     * Example:
     *
     *     res.j({ message: 'text', result: {} });
     */
    j: (body: ICustomResponse) => this;
  }
}

const customResponseHandler: RequestHandler = (_req, res, next) => {
  res.j = (body: ICustomResponse) => res.json(body);

  next();
};

export default customResponseHandler;
