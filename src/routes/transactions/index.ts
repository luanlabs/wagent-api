import express from 'express';

import getTransactionByOrderId from './getTransactionByOrderId';

const router = express.Router();

router.get('/:id', getTransactionByOrderId);

export default router;
