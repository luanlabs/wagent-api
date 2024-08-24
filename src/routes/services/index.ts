import express from 'express';

import saveNotificationTokenHandler from './saveNotificationTokenHandler';
import unsubscribeNotificationTokenHandler from './unsubscribeNotificationTokenHandler';
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post('/notification', authMiddleware, saveNotificationTokenHandler);
router.post('/notification/unsubscribe', authMiddleware, unsubscribeNotificationTokenHandler);

export default router;
