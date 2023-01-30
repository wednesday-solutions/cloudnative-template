import { SequelizeInstance } from './instance';

/**
 * Connection to the current database!
 */
export const dbConnection = new SequelizeInstance(
  process.env.DB_DATABASE ?? 'fastify_postgres_template',
  process.env.DB_USERNAME ?? 'fastify_postgres_template',
  process.env.DB_PASSWORD ?? 'fastify_postgres_template',
  {
    dialect: process.env.DB_DIALECT ?? 'postgres',
  },
);

// Expose instance and re-export everything sequelize
export * from './instance';
export * from 'sequelize';

// Models
export * from './models/tenant/tenant.model';
export * from './models/user/user.model';

export default dbConnection;
