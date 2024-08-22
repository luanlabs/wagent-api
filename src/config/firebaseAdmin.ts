import admin from 'firebase-admin';

import getEnvs from './getEnvs';

const { SERVICE_ACCOUNT_KEY } = getEnvs();

const serviceAccount = JSON.parse(SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;