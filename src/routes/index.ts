import express from 'express';

import usersRoutes from './users';
import ordersRoutes from './orders';
import tokensRoutes from './tokens';
import swaggerRoutes from './swagger';
import servicesRoutes from './services';
import notFoundHandler from './notFoundHandler';
import errorHandler from './errorHandler';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);
router.use('/tokens', tokensRoutes);
router.use('/swagger', swaggerRoutes);
router.use('/services', servicesRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;
