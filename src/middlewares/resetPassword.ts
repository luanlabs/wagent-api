import {Request, Response} from "express";

import User from "../models/User";
import {sendResetPasswordSuccess} from "../utils/emailService";

const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        console.log('Request body:', req.body);
        if (!user) {
            return res.status(404).json({ error: { message: 'Invalid or expired token', code: 404 } });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        sendResetPasswordSuccess(user.email);

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ error: { message: 'Error occurred!', code: 500 } });
    }
};
export default resetPassword;