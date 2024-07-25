import express from 'express';

import requestPasswordReset from '../../middlewares/requestPasswordReset';
import resetPassword from "../../middlewares/resetPassword";
import loginUserHandler from './loginUserHandler';
import registerUserHandler from './registerUserHandler';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import editProfileUserHandler from './editProfileUserHandler';
import verifyEmail from "../../middlewares/verifyEmail";

const router = express.Router();

router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);

router.post('/auth', registerUserHandler);
router.post('/auth/login', loginUserHandler);
router.post('/reset-password', resetPassword);
router.put('/:id/settings', editProfileUserHandler);
router.post('/password-reset', requestPasswordReset);
router.get('/verify-email', verifyEmail);

export default router;
