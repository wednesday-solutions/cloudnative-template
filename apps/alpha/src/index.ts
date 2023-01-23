import fastify from 'fastify';

const server = fastify();

async function main() {
  try {
    await server.listen({ port: 5000, host: '0.0.0.0' });
    console.info(`Listening for requests on port 5000...`);
  } catch (error) {
    console.error(error);
    throw new Error('Server failed to start!');
  }
}

void main();
