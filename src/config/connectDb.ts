import { connect } from 'mongoose';
import log from '../logger';

const connectDb = async (uri: string, dbName: string) => {
  try {
    await connect(uri, { dbName });

    log.info({ message: `Connected to database: ${dbName}` });
  } catch (err) {
    log.fatal({ message: 'Error connecting to DB' });

    process.exit(1);
  }
};
export default connectDb;
