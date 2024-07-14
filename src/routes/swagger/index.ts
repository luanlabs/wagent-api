import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import configSwagger from './configSwagger';

const router = express.Router();
const specs = swaggerJSDoc(configSwagger());

router.use('/', serve, setup(specs));

export default router;
