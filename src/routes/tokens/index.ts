import express from 'express';

import { wrap } from '../../utils/asyncHandler';
import getTokenHandler from './getTokens';
import editTokenHandler from './editToken';
import createTokenHandler from './createToken';
import deleteTokenHandler from './deleteToken';

const router = express.Router();

router.get('/', wrap(getTokenHandler));
router.post('/', wrap(createTokenHandler));
router.put('/:symbol', wrap(editTokenHandler));
router.delete('/:symbol', wrap(deleteTokenHandler));

export default router;
