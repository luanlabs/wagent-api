import envs from '../../config/envs';

const configSwagger = () => {
  const { SWAGGER_API_URL, PORT, NODE_ENV } = envs();

  const servers = [
    {
      url: SWAGGER_API_URL,
    },
  ];

  if (NODE_ENV != 'production') {
    servers.unshift({
      url: `http://localhost:${PORT}`,
    });
  }

  return {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Wagent API',
        version: '0.1.0',
        description: 'Wagent API',
      },
      servers,
    },
    apis: ['./src/swagger/**/*.ts'],
  };
};

export default configSwagger;
