import express from 'express';
import getTransactionsHandler from './getTransactionsHandler';
import getTransactionWithIdHandler from './getTransactionWithIdHandler';

const router = express.Router();

router.get('/', getTransactionsHandler);
router.get('/:id', getTransactionWithIdHandler);

export default router;
