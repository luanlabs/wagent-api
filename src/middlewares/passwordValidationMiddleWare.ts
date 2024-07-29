import { RequestHandler } from 'express';
import { z } from 'zod';

import { validatePassword } from '../utils/validators';

const passwordSchema = z.object({
    password: z.string().refine(validatePassword, 'Password must be at least 8 characters long'),
});

const passwordValidationMiddleware: RequestHandler = (req, res, next) => {
    const result = passwordSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }

    req.body = result.data;
    next();
};

export default passwordValidationMiddleware;
