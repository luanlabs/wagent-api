import express from 'express';

import loginHandler from './login';
import verifyHandler from './verify';
import registerHandler from './register';
import { wrap } from '../../../utils/asyncHandler';
import resetPasswordHandler from './resetPassword';
import requestResetPasswordHandler from './requestResetPassword';
import validateResetPasswordHandler from './validateResetPassword';
import requestVerificationTokenHandler from './requestVerificationToken';
import requestEnabledAuthenticatorHandler from './requestEnabledAuthenticator';
import enableAuthenticatorHandler from './enableAuthenticator';

const router = express.Router();

router.post('/', wrap(registerHandler));
router.post('/login', wrap(loginHandler));

router.put('/reset', wrap(resetPasswordHandler));
router.post('/reset', wrap(requestResetPasswordHandler));
router.get('/reset/:token', wrap(validateResetPasswordHandler));

router.put('/verify', wrap(verifyHandler));
router.post('/verify', wrap(requestVerificationTokenHandler));

router.post('/authenticator', wrap(requestEnabledAuthenticatorHandler));
router.put('/authenticator', wrap(enableAuthenticatorHandler));

export default router;
