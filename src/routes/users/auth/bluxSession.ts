import { z } from 'zod';
import { RequestHandler } from 'express';

import { sign } from '../../../utils/jwt';
import validatorMiddleware from '../../../middlewares/validatorMiddleware';
import { BluxVerificationError, verifyBluxSession } from '../../../utils/blux';
import { BluxUserConflictError, syncBluxUser } from '../../../utils/syncBluxUser';

const sessionBody = z.object({
  bluxToken: z.string().trim().min(1, 'Blux session is required'),
});

const bluxSessionHandler: RequestHandler[] = [
  validatorMiddleware({
    body: sessionBody,
  }),
  async (req, res) => {
    const { bluxToken } = req.body as z.infer<typeof sessionBody>;

    try {
      const identity = await verifyBluxSession(bluxToken);
      const { user } = await syncBluxUser(identity);
      const token = sign(String(user._id));

      return res.status(200).j({
        message: 'Login was successful',
        result: {
          token,
          address: user.address,
        },
      });
    } catch (error) {
      if (error instanceof BluxVerificationError) {
        return res.status(error.status).j({
          message: 'Login failed',
          error: {
            message: error.message,
          },
        });
      }

      if (error instanceof BluxUserConflictError) {
        return res.status(409).j({
          message: 'Login failed',
          error: {
            message: error.message,
          },
        });
      }

      throw error;
    }
  },
];

export default bluxSessionHandler;
