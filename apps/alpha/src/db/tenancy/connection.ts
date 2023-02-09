import { SequelizeInstance } from '../instance';

/**
 * Connection to the main database which stores the tenants
 * and tenant related metadata.
 *
 * @returns Sequelize connection
 */
export function getMainDBConnection() {
  const _conn = new SequelizeInstance(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  );

  return _conn;
}

/**
 * Connect to the tenant db with the provided tenant creds
 *
 * @param [tenantAccessKey] - unique access key to identify the tenant
 * @param [username] - username of the current user trying to login
 * @param [password] - password of the user trying to login
 * @returns Sequelize connection
 */
// export function getTenantDBConnection(
//   tenantAccessKey: string,
//   username: string,
//   password: string,
// ) {
//   // TODO: Verify if the tenant exists
//   // 1. Hit the cache if exists then verify
//   // 1.1 If not in cache - should we verify with db?
//   // 1.2 Reject and return null
//   const _conn = new SequelizeInstance();
// }
