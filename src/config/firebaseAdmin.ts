import admin from 'firebase-admin';
import * as path from 'path';

import getEnvs from "./getEnvs";

const {SERVICE_ACCOUNT_KEY} = getEnvs()

const serviceAccountPath = path.resolve(__dirname, SERVICE_ACCOUNT_KEY);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
