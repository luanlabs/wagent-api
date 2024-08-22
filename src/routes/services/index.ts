import express from 'express';

import saveNotificationTokenHandler from './saveNotificationTokenHandler'

const router = express.Router();

router.post('/notification', saveNotificationTokenHandler);

export default router;
