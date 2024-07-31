import express from 'express';

import addNewTokenHandler from './addNewTokenHandler';

const router = express.Router();

router.post('/', addNewTokenHandler);

export default router;
