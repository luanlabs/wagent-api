import fs from 'fs';
import admin from 'firebase-admin';

import envs from './envs';

const { FIREBASE_CONFIG_FILE_PATH } = envs();

const file = fs.readFileSync(FIREBASE_CONFIG_FILE_PATH, { encoding: 'utf8' });
const serviceAccount = JSON.parse(file);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
