import express from 'express';

import loginHandler from './loginHandler';
import verifyHandler from './verifyHandler';
import registerHandler from './registerHandler';
import requestVerifyHandler from './requestVerifyHandler';
import resetPasswordHandler from './resetPasswordHandler';
import requestResetPasswordHandler from './requestResetPasswordHandler';
import validateResetPasswordHandler from './validateResetPasswordHandler';

const router = express.Router();

router.post('/', registerHandler);
router.post('/login', loginHandler);
router.put('/reset', resetPasswordHandler);
router.get('/reset', validateResetPasswordHandler);
router.post('/reset', requestResetPasswordHandler);
router.put('/verify', verifyHandler);
router.post('/verify', requestVerifyHandler);

export default router;
