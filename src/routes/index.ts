import express from 'express';

import usersRoutes from './user';
import swaggerRoutes from './swagger';
import notFoundHandler from './notFoundHandler';
import errorHandler from './errorHandler';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/swagger', swaggerRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;
