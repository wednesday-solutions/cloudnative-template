import { createSequelizeInstanceForTesting } from 'fastify-postgres-database';

export const databaseInstance = createSequelizeInstanceForTesting();
export * from '../support';
