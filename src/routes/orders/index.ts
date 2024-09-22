import express from 'express';

import getOrderByIdHandler from './getOrderById';
import createOrderHandler from './createOrder';
import cancelOrderByIdHandler from './cancelOrderById';
import createTransactionHandler from './createTransaction';

const router = express.Router();

router.post('/', createOrderHandler);
router.get('/:id', getOrderByIdHandler);
router.delete('/:id', cancelOrderByIdHandler);
router.post('/:id/transactions', createTransactionHandler);

export default router;
