import express from 'express';

import authRoutes from './auth';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import subscribeUserHandler from './subscribeUserHandler';
import editProfileUserHandler from './editProfileUserHandler';
import unsubscribeUserHandler from './unsubscribeUserHandler';
import generateNewApiKeyHandler from './generateNewApiKeyHandler';
import validateEditProfileToken from '../../middlewares/validateEditProfileToken';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);
router.put('/:id/settings', validateEditProfileToken, editProfileUserHandler);
router.put('/:id/apiKey', generateNewApiKeyHandler);
router.post('/subscribe', subscribeUserHandler);
router.post('/unsubscribe', unsubscribeUserHandler);

export default router;
