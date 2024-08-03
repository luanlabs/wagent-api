import bunyan from 'bunyan';

import getEnvs from './getEnvs';

const { LOG_FILE_PATH } = getEnvs();

const streams: bunyan.Stream[] = [
  {
    level: bunyan.TRACE,
    stream: process.stdout,
  },
];

if (process.env.NODE_ENV == 'production') {
  streams[0] = {
    level: bunyan.TRACE,
    path: LOG_FILE_PATH,
  };
}

export const log = bunyan.createLogger({
  name: 'WAGENT_API',
  level: bunyan.TRACE,
  src: true,
  streams,
});

delete log.fields.hostname;
delete log.fields.pid;
delete log.fields.v;
delete log.fields.level;

export default log;
