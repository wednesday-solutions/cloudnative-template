import FastifyServer from './bootstrapper';

if (!process.env.PORT) {
  throw new Error('PORT is unset');
}

const server = new FastifyServer({
  port: Number.parseInt(process.env.PORT, 10),
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
