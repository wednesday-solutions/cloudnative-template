import { SequelizeInstance } from './instance';

export const dbConnection = new SequelizeInstance(
  process.env.DB_DATABASE ?? 'fastify_postgres_template',
  process.env.DB_USERNAME ?? 'fastify_postgres_template',
  process.env.DB_PASSWORD ?? 'fastify_postgres_template',
  {
    dialect: process.env.DB_DIALECT ?? 'postgres',
  },
);

export * from './instance';
export * from 'sequelize';

export default dbConnection;
