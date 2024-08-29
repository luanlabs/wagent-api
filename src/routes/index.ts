import express from 'express';

import usersRoutes from './users';
import ordersRoutes from './orders';
import tokensRoutes from './tokens';
import swaggerRoutes from './swagger';
import errorHandler from './errorHandler';
import notFoundHandler from './notFoundHandler';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);
router.use('/tokens', tokensRoutes);
router.use('/swagger', swaggerRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;
