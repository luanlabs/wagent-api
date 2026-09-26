import bunyan from 'bunyan';

import envs from './envs';

const { LOG_FILE_PATH } = envs();

const isProduction = process.env.NODE_ENV === 'production';

// In production log to a file; otherwise log to stdout for local development.
const streams: bunyan.Stream[] = [
  isProduction
    ? { level: bunyan.TRACE, path: LOG_FILE_PATH }
    : { level: bunyan.TRACE, stream: process.stdout },
];

export const log = bunyan.createLogger({
  name: 'WAGENT_API',
  level: bunyan.TRACE,
  // `src` computes call-site info on every log call, which is expensive; only
  // enable it outside production.
  src: !isProduction,
  streams,
});

delete log.fields.hostname;
delete log.fields.pid;
delete log.fields.v;
delete log.fields.level;

export default log;
