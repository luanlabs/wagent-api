import bunyan from 'bunyan';

import envs from './envs';

const { LOG_FILE_PATH } = envs();

const isProduction = process.env.NODE_ENV === 'production';

// Always log to stdout so local terminals and container logs show activity.
const streams: bunyan.Stream[] = [{ level: bunyan.TRACE, stream: process.stdout }];

if (isProduction) {
  streams.push({ level: bunyan.TRACE, path: LOG_FILE_PATH });
}

export const log = bunyan.createLogger({
  name: 'WAGENT_API',
  level: bunyan.TRACE,
  serializers: { err: bunyan.stdSerializers.err },
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
