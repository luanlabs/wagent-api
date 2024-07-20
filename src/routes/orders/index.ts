import express from 'express';

import getOrderByIdHandler from './getOrderByIdHandler';
import createNewOrderHandler from './createNewOrderHandler';

const router = express.Router();

router.get('/:id', getOrderByIdHandler);
router.post('/', createNewOrderHandler);

export default router;
