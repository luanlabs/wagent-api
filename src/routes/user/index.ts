import express from 'express';

import registerUserHandler from './register';
import loginUserHandler from './login';
import registerValidation from '../../middlewares/registerValidationMiddleware';
import loginValidation from '../../middlewares/loginValidationMiddleware';

const router = express.Router();

router.post('/auth', registerValidation, registerUserHandler);
router.post('/auth/login', loginValidation, loginUserHandler);

export default router;
