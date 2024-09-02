import express from 'express';

import getTokenHandler from './getTokens';
import editTokenHandler from './editToken';
import createTokenHandler from './createToken';
import deleteTokenHandler from './deleteToken';

const router = express.Router();

router.get('/', getTokenHandler);
router.post('/', createTokenHandler);
router.put('/:symbol', editTokenHandler);
router.delete('/:symbol', deleteTokenHandler);

export default router;
