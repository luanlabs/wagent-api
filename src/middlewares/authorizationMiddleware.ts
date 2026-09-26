import { RequestHandler } from 'express';

import User from '../models/User';
import { verify } from '../utils/jwt';
import { assertBluxProjectWallet, BluxVerificationError } from '../utils/blux';

const authorizationMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).j({
        message: 'Authorization token is required',
      });
    }

    const isValid = authorization.match(/^Bearer\s+(.+)$/i);

    if (!isValid) {
      return res.status(401).j({
        message: 'Authorization token is required',
      });
    }

    const token = authorization.replace(/^Bearer\s+/i, '');
    const id = verify(token);

    if (!id) {
      return res.status(401).j({
        message: 'Authorization token is invalid or expired',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).j({
        message: 'Authorization token is invalid or expired',
      });
    }

    await assertBluxProjectWallet(user);

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof BluxVerificationError) {
      const unavailable = error.status === 502 || error.status === 503;

      return res.status(unavailable ? 503 : 401).j({
        message: unavailable ? 'Blux verification is unavailable' : 'Authorization has failed',
        error: {
          message: error.message,
        },
      });
    }

    return res.status(401).j({
      message: 'Authorization has failed',
    });
  }
};

export default authorizationMiddleware;
