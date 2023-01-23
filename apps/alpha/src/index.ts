import FastifyServer from './bootstrapper';

const server = new FastifyServer({
  port: 5000,
  host: '0.0.0.0',
  logging: true,
  routes: [],
});

async function main() {
  try {
    await server.startServer();
    console.info(`Listening for requests on port 5000...`);
  } catch (error) {
    console.error(error);
    throw new Error('Server failed to start!');
  }
}

void main();
