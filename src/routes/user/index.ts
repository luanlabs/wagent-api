import express from 'express';

import registerUserHandler from './register';
import loginUserHandler from './login';

const router = express.Router();

router.post('/auth', registerUserHandler);
router.post('/auth/login', loginUserHandler);

export default router;
