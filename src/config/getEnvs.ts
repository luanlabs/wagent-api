import enforceEnv from 'envil';

const getEnvs = () => {
  const envVariables = [
    'DB_URI',
    'DB_NAME',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_HOST',
    'LOG_FILE_PATH',
    'ADMIN_PASSWORD',
    'SWAGGER_API_URL',
    'FRONTEND_URL',
    'LOG_FILENAME',
    'LOG_DIRNAME',
  ];
  return enforceEnv(envVariables, { returnValues: true });
};
export default getEnvs;
