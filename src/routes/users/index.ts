import express from 'express';

import authRoutes from './auth';
import editUserHandler from './editUser';
import getUserDetailsHandler from './getUserDetails';
import generateNewApiKeyHandler from './generateNewApiKey';
import getUserTransactionsHandler from './getUserTransactions';
import editUserSubscriptionHandler from './editUserSubscription';
import createNotificationTokenHandler from './createNotification';

const router = express.Router();

router.put('/', editUserHandler);
router.get('/', getUserDetailsHandler);
router.use('/auth', authRoutes);
router.put('/api-key', generateNewApiKeyHandler);
router.get('/transactions', getUserTransactionsHandler);
router.put('/subscription', editUserSubscriptionHandler);
router.post('/notification', createNotificationTokenHandler);

export default router;
