import express from 'express';

import saveNotificationTokenHandler from './saveNotificationTokenHandler'
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post('/notification', authMiddleware ,saveNotificationTokenHandler);

export default router;
