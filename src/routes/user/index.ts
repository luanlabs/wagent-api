import express from 'express';

import registerUserHandler from './register';
import loginUserHandler from './login';
import {requestPasswordReset} from "../../middlewares/requestPasswordReset";
import {resetPassword} from "../../middlewares/resetPassword";
import {validateResetToken} from "../../middlewares/validateTokenReset"

const router = express.Router();

router.post('/auth', registerUserHandler);
router.post('/auth/login', loginUserHandler);
router.post('/password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/validate-reset-token/:token', validateResetToken);

export default router;
