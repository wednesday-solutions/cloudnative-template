import { BadRequestError } from 'fastify-custom-errors';
import { QueryTypes } from 'sequelize';
import type { CacheTenantRecord, TenantRecords } from '../../cache';
import { MainCacheInstance } from '../../cache';
import { SequelizeInstance } from '../instance';
import { getMainDBConnection } from './main-db-connection';

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
  let meta: CacheTenantRecord | string | null = await cache.get(
    tenantAccessKey,
  );

  if (!meta) {
    const mainDBConnection = getMainDBConnection();
    await mainDBConnection.instance.authenticate();

    const record = await mainDBConnection.instance.query(`
    SELECT
        "id",
        "public_uuid",
        "name",
        "email",
        "company_name",
        "tenant_access_key",
        "created_at"
    FROM "tenants"
    WHERE "tenant_access_key" = :tak;
    `.trim(), { type: QueryTypes.SELECT, replacements: { tak: tenantAccessKey } }) as unknown as TenantRecords;

    if ((record as any).length === 0) {
      throw new BadRequestError('Invalid credentials!');
    }

    const lastUpdated = Date.now();
    meta = { record, lastUpdated };
  } else {
    meta = JSON.parse(meta);
  }

  const _conn = new SequelizeInstance(tenantAccessKey, username, password);

  return _conn;
}
