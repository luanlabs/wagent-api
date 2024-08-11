import { RequestHandler } from 'express';

interface ICustomResponse {
  message?: object | string;
  result?: object | string | null;
  error?: object | string;
}

declare module 'express-serve-static-core' {
  interface Response {
    /**
     * Json a response.
     *
     * Examples:
     *
     *     res.j({
     *      message: 'text'
     *      result?: {} | null
     *     });
     */
    j: (body: ICustomResponse) => this;
  }
}

const customResponseHandler: RequestHandler = (_, res, next) => {
  res.j = (body: ICustomResponse) => {
    res.type('json');
    res.send(body);
    res.json;

    return res;
  };

  next();
};

export default customResponseHandler;
