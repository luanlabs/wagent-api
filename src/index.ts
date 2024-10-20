import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import db from './config/db';
import routes from './routes';
import envs from './config/envs';
import log from './config/logger';
import saveCurrencies from './utils/saveCurrencies';
import checkExpiredTime from './utils/orders/checkExpiredTime';
import customResponseHandler from './middlewares/customResponseHandler';

const app = express();

const { DB_URI, DB_NAME, PORT } = envs();

db(DB_URI, DB_NAME);

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

saveCurrencies();
checkExpiredTime();

app.use(customResponseHandler);
app.use(routes);

app.listen(PORT, () => {
  log.info(`APP: Started on :${PORT}`);
});
