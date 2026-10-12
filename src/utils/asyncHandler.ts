import { RequestHandler } from 'express';

/**
 * Wraps an Express handler so a rejected promise is forwarded to the error
 * handling middleware. Express 4 does not do this automatically for async
 * handlers, so an unhandled rejection would otherwise crash the process or
 * leave the request hanging instead of returning a 500.
 */
const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) => {
    // Express clears baseUrl when an error unwinds through mounted routers.
    if (req.route) {
      res.locals.requestRoute = `${req.baseUrl}${req.route.path}`;
    }
    Promise.resolve(handler(req, res, next)).catch(next);
  };

/**
 * Wraps a single handler or an array of handlers (the shape route modules
 * export) so every one of them has async rejections forwarded to `next`.
 */
export const wrap = (handlers: RequestHandler | RequestHandler[]): RequestHandler[] =>
  (Array.isArray(handlers) ? handlers : [handlers]).map(asyncHandler);

export default asyncHandler;
