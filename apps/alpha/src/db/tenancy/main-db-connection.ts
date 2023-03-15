import type { Options } from 'sequelize';
import { SequelizeInstance } from '../instance';

/**
 * Connection to the main database which stores the tenants
 * and tenant related metadata.
 *
 * @param [opts] - Options bag to forward to sequelize
 * @returns Sequelize connection
 */
export function getMainDBConnection(opts?: Options) {
  if (!process.env.DB_DATABASE) {
    throw new Error('Expected `DB_DATABASE` to be defined but was not set!');
  }

  if (!process.env.DB_USERNAME) {
    throw new Error('Expected `DB_USERNAME` to be defined but was not set!');
  }

  if (!process.env.DB_PASSWORD) {
    throw new Error('Expected `DB_PASSWORD` to be defined but was not set!');
  }

  const _conn = new SequelizeInstance(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    opts,
  );

  return _conn;
}
