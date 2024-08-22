import enforceEnv from 'envil';

const getEnvs = () => {
  const envVariables = [
    'DB_URI',
    'DB_NAME',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'LOG_FILE_PATH',
    'ADMIN_PASSWORD',
    'SWAGGER_API_URL',
    'SERVICE_ACCOUNT_KEY',
  ];
  return enforceEnv(envVariables, { returnValues: true });
};
export default getEnvs;
