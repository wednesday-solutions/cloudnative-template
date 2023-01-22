import fastify from 'fastify';

const server = fastify();

server.listen({
  port: 5000,
}, () => {});
