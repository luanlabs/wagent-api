import express from 'express';
import getTransactionsHandler from './getTransactionsHandler';
import createTransactionHandler from './createTransactionHandler';

const router = express.Router();

router.get('/', getTransactionsHandler);
router.post('/', createTransactionHandler);

export default router;
