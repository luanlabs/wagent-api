import express from 'express';
import getOrderAndPaymentUser from './getOrderAndPaymentUser';

const router = express.Router();

router.post('/:id/payment', getOrderAndPaymentUser);

export default router;
