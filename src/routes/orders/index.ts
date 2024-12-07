import express from 'express';

import getOrderByIdHandler from './getOrderById';
import createOrderHandler from './createOrder';
import cancelOrderByIdHandler from './cancelOrderById';

const router = express.Router();

router.post('/', createOrderHandler);
router.get('/:id', getOrderByIdHandler);
router.delete('/:id', cancelOrderByIdHandler);

export default router;
