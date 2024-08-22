import express from 'express';

import sendNotificationHandler from './notificationHandler'

const router = express.Router();

router.post('/notification', sendNotificationHandler);

export default router;
