module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Apollo App Documentation',
      version: '1.0.0',
      description:
        'Here lies the documentation for the Apollo App. We display endpoints with required parameters and the data each endpoint returns.',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License',
      },
    },
    tags: [
      {
        name: 'profile',
        description: 'Operations for profile',
      },
      {
        name: 'topic',
        description: 'Operations for topics',
      },
      {
        name: 'requests',
        description: 'Operations for requests',
      },
    ],
    externalDocs: {
      description: 'Apollo Team Github',
      url:
        'https://github.com/orgs/Lambda-School-Labs/teams/labs26-apollo-teamc/repositories',
    },
    components: {
      securitySchemes: {
        okta: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Okta idToken JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        BadRequest: {
          description: 'Bad request. profile already exists',
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'Not Found',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/**/*Router.js'],
};
