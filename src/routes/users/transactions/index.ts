import express from 'express';
import getTransactionsHandler from './getTransactionsHandler';

const router = express.Router();

router.get('/', getTransactionsHandler);

export default router;
