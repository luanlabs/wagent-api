import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

import envs from './envs';
import log from './logger';

const { FIREBASE_CONFIG_FILE_PATH } = envs();

// Initialise the Firebase Admin SDK once at startup. A missing/invalid service
// account file is fatal: without it push notifications cannot be sent.
try {
  const file = fs.readFileSync(FIREBASE_CONFIG_FILE_PATH, { encoding: 'utf8' });
  const serviceAccount = JSON.parse(file);

  initializeApp({ credential: cert(serviceAccount) });

  log.info('FIREBASE: Initialized');
} catch (err) {
  log.fatal(`FIREBASE: Failed to initialize from ${FIREBASE_CONFIG_FILE_PATH} - ${err}`);
  throw err;
}

export default getMessaging;
