import getEnvs from '../../config/getEnvs';

const configSwagger = () => {
    const { SWAGGER_API_URL, PORT, NODE_ENV } = getEnvs();

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
                description:
                    'This API provides services related to games and players. It includes various details such as game features, statistics, and information about gamers and players.',
            },
            servers,
        },
        apis: ['./src/swagger/**/*.ts'],
    };
};

export default configSwagger;
