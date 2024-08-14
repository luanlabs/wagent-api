import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/User';

const validateEditProfileToken: RequestHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                result: { success: false },
                error: {
                    message: 'Authorization token is required',
                    code: 401,
                },
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        if (typeof decodedToken !== 'object' || !decodedToken || !('userId' in decodedToken)) {
            return res.status(401).json({
                result: { success: false },
                error: {
                    message: 'Invalid token payload',
                    code: 401,
                },
            });
        }

        req.user = {
            _id: (decodedToken as JwtPayload).userId as string,
        } as IUser;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                result: { success: false },
                error: {
                    message: 'Invalid or expired token',
                    code: 401,
                },
            });
        }
        return res.status(500).json({
            result: { success: false },
            error: {
                message: error.message || 'An error occurred during token verification',
                code: 500,
            },
        });
    }
};

export default validateEditProfileToken;