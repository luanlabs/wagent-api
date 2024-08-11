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
    'LOG_FILE_PATH',
    'ADMIN_PASSWORD',
    'SWAGGER_API_URL',
    'FRONTEND_URL',
  ];
  return enforceEnv(envVariables, { returnValues: true });
};
export default getEnvs;
