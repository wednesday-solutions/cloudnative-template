import defaults from 'lodash/defaults';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';

/**
 * Class for creating new Sequelize Instances
 */
export class SequelizeInstance {
  /**
   * Instance of sequelize connected to the database instance
   */
  readonly instance: Sequelize;

  /**
   * Generate a new sequelize instance and assign it to instance
   *
   * @param [db] - database to connect to
   * @param [user] - user to connect iwth
   * @param [pass] - password to use for authentication
   * @param [options] - Sequelize options bag
   */
  constructor(db: string, user: string, pass: string, options?: Options) {
    this.instance = getSequelizeInstance(db, user, pass, options);
  }
}

/**
 * Create a sequelize instance for testing
 *
 * @param [options] - options bag forwarded to sequelize
 * @returns an instance of sequelize
 */
export function createSequelizeInstanceForTesting(options: Options = {}): Sequelize {
  const sequelizeOptions = defaults(options, {
    host: '0.0.0.0',
    logging: false,
    dialect: 'postgres',
    port: 23_010,
  });

  return getSequelizeInstance('fastify_postgres_template', 'fastify_postgres_template', 'fastify_postgres_template', sequelizeOptions);
}

/**
 * Get a new sequelize instance to connect to the DB
 *
 * @param [db] - database to connect to
 * @param [user] - user to authenticate with
 * @param [pass] - password to use for authentication
 * @param [options] - options bag forwarded to sequelize
 * @returns an instance of sequelize
 */
function getSequelizeInstance(db: string, user: string, pass: string, options?: Options): Sequelize {
  options = options || {};

  return new Sequelize(db, user, pass, options);
}
