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
export async function getMainDBConnection() {
  const _conn = new SequelizeInstance(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  );

  await _conn.instance.authenticate();

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
    const mainDBConnection = await getMainDBConnection();
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
