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
    'SWAGGER_API_URL',
  ];
  return enforceEnv(envVariables, { returnValues: true });
};
export default getEnvs;
