import express from 'express';

import saveNotificationTokenHandler from './saveNotificationTokenHandler';
import unsubscribeNotificationTokenHandler from './unsubscribeNotificationTokenHandler';
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post('/notifications', authMiddleware, saveNotificationTokenHandler);
router.delete('/notifications', authMiddleware, unsubscribeNotificationTokenHandler);

export default router;
