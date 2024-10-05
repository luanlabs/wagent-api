import express from 'express';

import loginHandler from './login';
import verifyHandler from './verify';
import registerHandler from './register';
import resetPasswordHandler from './resetPassword';
import requestResetPasswordHandler from './requestResetPassword';
import validateResetPasswordHandler from './validateResetPassword';
import requestVerificationTokenHandler from './requestVerificationToken';
import requestEnabledGoogleAuthenticatorHandler from './requestEnabledGoogleAuthenticator';
import enableGoogleAuthenticatorHandler from './enableGoogleAuthenticator';

const router = express.Router();

router.post('/', registerHandler);
router.post('/login', loginHandler);

router.put('/reset', resetPasswordHandler);
router.post('/reset', requestResetPasswordHandler);
router.get('/reset/:token', validateResetPasswordHandler);

router.put('/verify', verifyHandler);
router.post('/verify', requestVerificationTokenHandler);

router.post('/google', requestEnabledGoogleAuthenticatorHandler);
router.put('/google', enableGoogleAuthenticatorHandler);

export default router;
