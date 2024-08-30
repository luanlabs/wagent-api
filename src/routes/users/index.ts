import express from 'express';

import authRoutes from './auth';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import userSubscription from './userSubscription';
import editProfileUserHandler from './editProfileUserHandler';
import generateNewApiKeyHandler from './generateNewApiKeyHandler';
import validateEditProfileToken from '../../middlewares/validateEditProfileToken';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);
router.put('/:id/settings', validateEditProfileToken, editProfileUserHandler);
router.put('/:id/apiKey', generateNewApiKeyHandler);
router.post('/subscribe', userSubscription);

export default router;