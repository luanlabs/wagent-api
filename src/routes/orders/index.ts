import express from 'express';

import { wrap } from '../../utils/asyncHandler';
import createOrderHandler from './createOrder';
import getOrderByIdHandler from './getOrderById';
import addPayerEmailByIdHandler from './addPayerEmailById';
import cancelOrderByIdHandler from './cancelOrderById';

const router = express.Router();

router.post('/', wrap(createOrderHandler));
router.get('/:id', wrap(getOrderByIdHandler));
router.put('/:id', wrap(addPayerEmailByIdHandler));
router.delete('/:id', wrap(cancelOrderByIdHandler));

export default router;
