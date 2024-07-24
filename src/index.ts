import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import log from './logger';
import router from './routes';
import getEnvs from './config/getEnvs';
import connectDb from './config/connectDb';
import customResponseHandler from './middlewares/customResponseHandler';

const app = express();

const { DB_URI, DB_NAME, PORT } = getEnvs();

connectDb(DB_URI, DB_NAME);

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(customResponseHandler);
app.use(router);

app.listen(PORT, () => {
  log.info({ message: 'App started' });
});
