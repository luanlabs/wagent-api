import express from 'express';

import requestPasswordReset from '../../middlewares/requestPasswordReset';
import resetPassword from "../../middlewares/resetPassword";
import userLoginHandler from './userLoginHandler';
import userRegistrationHandler from './userRegistrationHandler';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import editProfileUserHandler from './editProfileUserHandler';
import verifyEmail from "../../middlewares/verifyEmail";
import passwordValidationMiddleware from "../../middlewares/passwordValidationMiddleWare";

const router = express.Router();

router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);

router.post('/auth', userRegistrationHandler);
router.post('/auth/login', userLoginHandler);
router.post('/auth/password', passwordValidationMiddleware, resetPassword);
router.put('/:id/settings', editProfileUserHandler);
router.post('/auth/reset', requestPasswordReset);
router.get('/auth/verify', verifyEmail);

export default router;
