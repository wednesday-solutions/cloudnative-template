import dotenv from 'dotenv';
import FastifyServer from './bootstrapper';
import { tenantSchemas } from './modules/tenant/tenant.routes';
import { userSchemas } from './modules/user/user.routes';
import { verifyEnv } from './utils';
import { FALLBACK_PORT } from './utils/constants';

verifyEnv();

dotenv.config();

const server = new FastifyServer({
  port: Number.parseInt(process.env.PORT ?? FALLBACK_PORT, 10),
  host: '0.0.0.0',
  logging: true,
  schemas: [userSchemas, tenantSchemas],
});

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
