import express from 'express';

import requestPasswordReset from '../../middlewares/requestPasswordReset';
import resetPassword from '../../middlewares/resetPassword';
import userLoginHandler from './userLoginHandler';
import userRegistrationHandler from './userRegistrationHandler';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import editProfileUserHandler from './editProfileUserHandler';
import subscribeUserHandler from "./subscribeUserHandler";
import unsubscribeUserHandler from "./unsubscribeUserHandler";
import generateNewApiKeyHandler from './generateNewApiKeyHandler';
import verifyEmail from "../../middlewares/verifyEmail";
import passwordValidationMiddleware from "../../middlewares/passwordValidationMiddleWare";
import validateResetToken from "../../middlewares/validateResetToken";
import validateVerifyToken from "../../middlewares/validateVerifyToken";
import authMiddleware from "../../middlewares/authMiddleware";


const router = express.Router();

router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);

router.post('/auth', userRegistrationHandler);
router.post('/auth/login', userLoginHandler);
router.post('/auth/password', passwordValidationMiddleware, resetPassword);
router.put('/:id/apiKey', generateNewApiKeyHandler);
router.put('/:id/settings' , authMiddleware, editProfileUserHandler);
router.post('/auth/reset', requestPasswordReset);
router.get('/auth/verify', verifyEmail);
router.get('/auth/reset/verify', validateResetToken);
router.get('/auth/verify', validateVerifyToken);
router.post('/subscribe', subscribeUserHandler);
router.post('/unsubscribe', unsubscribeUserHandler);

export default router;
