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

<<<<<<< HEAD
<<<<<<< HEAD
const {DB_URI, DB_NAME, PORT} = getEnvs();
=======
const { DB_URI, DB_NAME, PORT } = getEnvs();
>>>>>>> 52a9975 (chore: fix code)

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
<<<<<<< HEAD
    console.log(`Server is running on port ${PORT}`);
=======
app.get('/a', (req, res) => {
    res.send('???');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
>>>>>>> 1ad8615 (ci: add new configs)
=======
  log.info({ message: 'App started' });
>>>>>>> 52a9975 (chore: fix code)
});
