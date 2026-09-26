import express from 'express';

import authRoutes from './auth';
import { wrap } from '../../utils/asyncHandler';
import editUserHandler from './editUser';
import getUserDetailsHandler from './getUserDetails';
import generateNewApiKeyHandler from './generateNewApiKey';
import getUserTransactionsHandler from './getUserTransactions';
import editUserSubscriptionHandler from './editUserSubscription';
import createNotificationTokenHandler from './createNotification';

const router = express.Router();

router.put('/', wrap(editUserHandler));
router.get('/', wrap(getUserDetailsHandler));
router.use('/auth', authRoutes);
router.put('/api-key', wrap(generateNewApiKeyHandler));
router.get('/transactions', wrap(getUserTransactionsHandler));
router.put('/subscription', wrap(editUserSubscriptionHandler));
router.post('/notification', wrap(createNotificationTokenHandler));

export default router;
