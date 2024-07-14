import express from 'express';

import verifyJwtTokenHandler from './verifyJwtTokenHandler';

const router = express.Router();

router.post('/', verifyJwtTokenHandler);

export default router;
