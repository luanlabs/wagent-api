import express from 'express';

import usersRoutes from './users';
import errorHandler from './error';
import ordersRoutes from './orders';
import tokensRoutes from './tokens';
import swaggerRoutes from './swagger';
import transactionsRoutes from './transactions';
import notFoundHandler from './notFound';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);
router.use('/tokens', tokensRoutes);
router.use('/swagger', swaggerRoutes);
router.use('/transactions', transactionsRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;
