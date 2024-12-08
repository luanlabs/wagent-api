import express from 'express';

import createOrderHandler from './createOrder';
import getOrderByIdHandler from './getOrderById';
import addPayerEmailByIdHandler from './addPayerEmailById';
import cancelOrderByIdHandler from './cancelOrderById';

const router = express.Router();

router.post('/', createOrderHandler);
router.get('/:id', getOrderByIdHandler);
router.put('/:id', addPayerEmailByIdHandler);
router.delete('/:id', cancelOrderByIdHandler);

export default router;
