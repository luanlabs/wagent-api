import { connect } from 'mongoose';

import log from '../config/logger';

const db = async (uri: string, dbName: string) => {
  try {
    await connect(uri, { dbName });

    log.info('DB: Connected');
  } catch (err) {
    log.fatal('DB: Failed to connect');

    process.exit(1);
  }
};
export default db;
