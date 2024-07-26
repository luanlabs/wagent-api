import {Request, Response} from "express";

import User from "../models/User";

const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: { message: 'Invalid or expired token', code: 400 } });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ error: { message: 'Error occurred!', code: 500 } });
    }
};
export default verifyEmail;