import enforceEnv from 'envil';

const envs = () => {
  const envVariables = [
    'PORT',
    'DB_URI',
    'DB_NAME',
    'NODE_ENV',
    'JWT_SECRET',
    'BLUX_APP_ID',
    'BLUX_APP_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'PAYMENT_URL',
    'FRONTEND_URL',
    'LOG_FILE_PATH',
    'ADMIN_PASSWORD',
    'SWAGGER_API_URL',
  ];

  return enforceEnv(envVariables, { returnValues: true });
};
export default envs;
