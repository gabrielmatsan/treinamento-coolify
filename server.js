const fastify = require("fastify")({ logger: true });

async function start() {
  try {
    await fastify.register(require("@fastify/swagger"), {
      swagger: {
        info: {
          title: "Treinamento Coolify API",
          description: "API for Coolify training",
          version: "1.0.0",
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Find more info here",
        },
        host: "localhost:3000",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
      },
    });

    await fastify.register(require("@fastify/swagger-ui"), {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });

    fastify.get(
      "/health",
      {
        schema: {
          description: "Health check endpoint",
          tags: ["health"],
          response: {
            200: {
              description: "Successful response",
              type: "object",
              properties: {
                status: { type: "string" },
                timestamp: { type: "string" },
                uptime: { type: "number" },
              },
            },
          },
        },
      },
      async (request, reply) => {
        return {
          status: "ok",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        };
      }
    );

    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
