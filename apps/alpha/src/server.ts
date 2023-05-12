import dotenv from 'dotenv';
import FastifyServer from './bootstrapper';
import { tenantSchemas } from './modules/alpha/tenant/tenant.routes';
import { userSchemas } from './modules/alpha/user/user.routes';
import { FALLBACK_PORT } from './utils/constants';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('PORT is unset');
}

export const server = new FastifyServer({
  port: Number(process.env.PORT ?? FALLBACK_PORT),
  host: '0.0.0.0',
  logging: true,
  schemas: [userSchemas, tenantSchemas],
});
