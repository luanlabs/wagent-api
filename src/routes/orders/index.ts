import express from 'express';

import getOrderByIdHandler from './getOrderById';
import createOrderHandler from './createOrder';
import createTransactionHandler from './createTransaction';

const router = express.Router();

router.post('/', createOrderHandler);
router.get('/:id', getOrderByIdHandler);
router.post('/:id/transactions', createTransactionHandler);

export default router;
