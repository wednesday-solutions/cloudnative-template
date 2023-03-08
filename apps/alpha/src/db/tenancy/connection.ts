import { QueryTypes } from 'sequelize';
import type { CacheTenantRecord, TenantRecords } from '../../cache';
import { MainCacheInstance } from '../../cache';
import { SequelizeInstance } from '../instance';

/**
 * Connection to the main database which stores the tenants
 * and tenant related metadata.
 *
 * @returns Sequelize connection
 */
export function getMainDBConnection() {
  if (!process.env.DB_DATABASE) {
    throw new Error('Expected `DB_DATATBASE` to be defined but was not set!');
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
export async function getTenantDBConnection(
  tenantAccessKey: string,
  username: string,
  password: string,
) {
  const cache = MainCacheInstance.getInstance().connection.cache;
  let meta: CacheTenantRecord | string | null = await cache.get(tenantAccessKey);

  if (!meta) {
    const mainDBConnection = getMainDBConnection();
    await mainDBConnection.instance.authenticate();

    const record = await mainDBConnection.instance.query(`
    SELECT
        "id",
        "tenant_access_key"
    FROM "main"."tenants"
    WHERE "tenant_access_key" = :tak;
    `, { type: QueryTypes.SELECT, replacements: { tak: tenantAccessKey } }) as unknown as TenantRecords;

    const lastUpdated = Date.now();
    meta = { record, lastUpdated };
  } else {
    meta = JSON.parse(meta);
  }

  const _conn = new SequelizeInstance(tenantAccessKey, username, password);

  return _conn;
}
