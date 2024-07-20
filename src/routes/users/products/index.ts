import express from 'express';

import addProductHandler from './addProductHandler';
import getProductsHandler from './getProductsHandler';

const router = express.Router();

router.post('/', addProductHandler);
router.get('/', getProductsHandler);

export default router;
