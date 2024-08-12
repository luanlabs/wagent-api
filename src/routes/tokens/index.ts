import express from 'express';

import addNewTokenHandler from './addNewTokenHandler';
import editTokenHandler from './editTokenHandler';
import getTokenHandler from './getTokensHandler';
import deleteTokenHandler from './deleteTokenHandler';

const router = express.Router();

router.get('/', getTokenHandler);
router.post('/', addNewTokenHandler);
router.put('/:address', editTokenHandler);
router.delete('/:address', deleteTokenHandler);

export default router;
