import express from 'express';

import usersRoutes from './users';
import verifyRoutes from './verify';
import ordersRoutes from './orders';
import swaggerRoutes from './swagger';
import notFoundHandler from './notFoundHandler';
import errorHandler from './errorHandler';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/verify', verifyRoutes);
router.use('/orders', ordersRoutes);
router.use('/swagger', swaggerRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;
