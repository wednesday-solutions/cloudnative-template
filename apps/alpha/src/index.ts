import { server } from './server';

/**
 * The `main` function initializes the server and starts the
 * server instance.
 */
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
