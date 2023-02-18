import FastifyServer from './bootstrapper';
import { userSchemas } from './db/models/user/user.schema';
import { verifyEnv } from './utils';

const server = new FastifyServer({
  port: Number.parseInt(process.env.PORT, 10),
  host: '0.0.0.0',
  logging: true,
  schemas: [userSchemas],
});

/**
 * The `main` function initializes the server and starts the
 * server instance.
 */
async function main() {
  try {
    verifyEnv();
    await server.startServer();
    console.info(`Listening for requests on port 5000...`);
  } catch (error) {
    console.error(error);
    throw new Error('Server failed to start!');
  }
}

void main();
