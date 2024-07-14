import bunyan from 'bunyan';
import getEnvs from './config/getEnvs';

const { LOG_FILE_PATH } = getEnvs();

let level = bunyan.TRACE;
let streams = [
    {
        level: bunyan.TRACE,
        stream: process.stdout,
    },
    {
        level: bunyan.WARN,
        path: LOG_FILE_PATH,
    },
];

if (process.env.NODE_ENV == 'production') {
    level = bunyan.WARN;
    streams = [
        {
            level: bunyan.WARN,
            path: LOG_FILE_PATH,
        },
    ];
}

export const log = bunyan.createLogger({
    name: 'wagent-app',
    level,
    src: true,
    streams,
});

export default log;
