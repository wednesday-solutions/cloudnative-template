import defaults from 'lodash/defaults';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';

export function createSequelizeInstanceForTesting(options: Options = {}): Sequelize {
  // TODO: Figure out a better way to handle envs maybe a ENV service?
  const sequelizeOptions = defaults(options, {
    host: '0.0.0.0',
    dialect: 'postgres',
    port: 23_010,
  });

  return getSequelizeInstance('fastify_postgres_template', 'fastify_postgres_template', 'fastify_postgres_template', sequelizeOptions);
}

// TODO: DON'T EXPORT THIS!
export function getSequelizeInstance(db: string, user: string, pass: string, options?: Options): Sequelize {
  options = options || {};

  return new Sequelize(db, user, pass, options);
}
