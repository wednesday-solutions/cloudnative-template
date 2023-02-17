import camelCase from 'lodash/camelCase';
import { QueryTypes } from 'sequelize';
import { getMainDBConnection } from '../db/tenancy/connection';
import { mapKeys } from '../utils';
import type { TenantRedisOptions } from './conn';
import { mainCacheConnection, tenantCacheConnection } from './conn';
import type { MainCache, TenantCache } from './instance';

/**
 * Main's cache singleton used for maintaining at most one cache connection
 * and reuse that connection for every request to main cache.
 */
export class MainCacheInstance {
  /**
   * Instance of main cache as a singleton
   */
  private static instance: MainCacheInstance;

  /**
   * Connection to the main's redis instance, this is not connected
   * until and unless `connect()` is called.
   *
   * @example
   * ```ts
   * const instance = MainCacheInstance.getInstance();
   * await instance.connect();
   * ```
   */
  connection: MainCache;

  /**
   * Connection is not established by default use the
   * `connect` method that exists on the `connection`
   */
  private constructor() {
    this.connection = mainCacheConnection();
  }

  /**
   * Get the pre-existing uninitialized connection to the main cache.
   * This is uninitialized by default or on the first `getInstance`.
   * This creates a new instance if `instance` is not defined or else
   * returns the pre-existing instance.
   *
   * @returns uninitialized connection to the main cache
   */
  static getInstance(): MainCacheInstance {
    if (!MainCacheInstance.instance) {
      MainCacheInstance.instance = new MainCacheInstance();
    }

    return MainCacheInstance.instance;
  }

  /**
   * Get all the tenants from the main db and store them in the cache.
   * Do note that this SHOULD NOT be called in the application but rather
   * through some CRON once in a decided time or only at the start or at
   * a full cache eviction.
   *
   * TODO: Set some sort of validation that disallows using this. Probably
   * some RBAC!
   *
   * - Time Complexity -> `2 * O(n)`
   * - Space Complexity -> `O(n)`
   */
  async updateOrGetAllTenantsMeta() {
    const db = await getMainDBConnection();
    const response: TenantRecords[] = await db.instance.query(`
    SELECT
      "id",
      "public_uuid",
      "tenant_access_key",
      "name",
      "email",
      "company_name",
      "created_at"
    FROM "main"."tenants";
    `.trim(), { type: QueryTypes.SELECT });

    const transformedResponse = mapKeys(response, camelCase);

    const lastUpdated = Date.now();
    const toCache: Array<Promise<string | null>> = [];
    for (const record of transformedResponse) {
      const meta: CacheTenantRecord = { record, lastUpdated };
      toCache.push(this.connection.cache.xadd(
        `${record.tenantAccessKey}`, JSON.stringify(meta),
      ));
    }

    // Push to cache
    await Promise.all(toCache);
  }
}

export interface TenantRecords {
  id: number;
  publicUuid: string;
  tenantAccessKey: string;
  name: string;
  email: string;
  companyName: string;
  createdAt: string;
}

export type CacheTenantRecord = { record: TenantRecords, lastUpdated: number };

/**
 * Tenant's cache singleton used for maintaining at most one cache connection
 * and reuse that connection for every request to tenant's cache.
 */
export class TenantCacheInstance {
  /**
   * Instance of tenant's cache as a singleton
   */
  private static instance: TenantCacheInstance;

  /**
   * Connection to the tenant's redis instance, this is not connected
   * until and unless `connect()` is called.
   *
   * @example
   * ```ts
   * const instance = TenantCacheInstance.getInstance();
   * await instance.connect();
   * ```
   */
  connection: TenantCache;

  /**
   * Connection is not established by default use the
   * `connect` method that exists on the `connection`
   *
   * @param [options] - connection options for tenant's cache
   * @param [options.thost] - tenant's redis host url
   * @param [options.tport] - tenant's redis port
   * @param [options.tusername] - tenant's redis username to authenticate with
   * @param [options.tpassword] - tenant's redis password to authenticate with
   */
  private constructor(options: TenantRedisOptions) {
    this.connection = tenantCacheConnection(options);
  }

  /**
   * Get the pre-existing or uninitialized connection to the tenant's cache.
   * This is uninitialized by default or on the first `getInstance`.
   * This creates a new instance if `instance` is not defined or else
   * returns the pre-existing instance.
   *
   * @param [options] - connection options for tenant's cache
   * @param [options.thost] - tenant's redis host url
   * @param [options.tport] - tenant's redis port
   * @param [options.tusername] - tenant's redis username to authenticate with
   * @param [options.tpassword] - tenant's redis password to authenticate with
   * @returns uninitialized connection to the main cache
   */
  static getInstance(options: TenantRedisOptions): TenantCacheInstance {
    if (!TenantCacheInstance.instance) {
      TenantCacheInstance.instance = new TenantCacheInstance(options);
    }

    return TenantCacheInstance.instance;
  }
}
