import express from 'express';

import loginUserHandler from './loginUserHandler';
import registerUserHandler from './registerUserHandler';
import productsRoutes from './products';
import transactionsRoutes from './transactions';
import deleteUserHandler from './deleteUserHandler';
import editProfileUserHandler from './editProfileUserHandler';

const router = express.Router();

router.use('/products', productsRoutes);
router.use('/transactions', transactionsRoutes);

router.post('/auth', registerUserHandler);
router.post('/auth/login', loginUserHandler);
router.delete('/:id', deleteUserHandler);
router.put('/:id/settings', editProfileUserHandler);

export default router;
