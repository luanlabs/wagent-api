import { RequestHandler } from 'express';
import { z } from 'zod';
import { validatePassword } from '../utils/validators';

const passwordSchema = z.object({
    password: z.string().refine(validatePassword, 'Password must be at least 8 characters long'),
});

const passwordValidationMiddleware: RequestHandler = (req, res, next) => {
    const result = passwordSchema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            message: err.message,
            path: err.path.join('.'),
        }));

        return res.status(400).json({ message: errors[0].message });
    }

    req.body = result.data;
    next();
};

export default passwordValidationMiddleware;
