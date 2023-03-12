import camelCase from 'lodash/camelCase';
import { Tenant } from '@/db';
import { mapKeys } from '../utils';
import { mainCacheConnection } from './conn';
import type { MainCache } from './instance';

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
    this.connection = mainCacheConnection(
      process.env.REDIS_HOST,
      process.env.REDIS_PORT,
      process.env.REDIS_PASSWORD,
      process.env.REDIS_USER,
    );
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
    const response = await Tenant.findAll({
      attributes: [
        'id',
        'public_uuid',
        'name',
        'email',
        'company_name',
        'tenant_access_key',
        'created_at',
      ],
    });
    const tenants = response.map(t => t.toJSON());
    const transformedResponse = mapKeys(tenants, camelCase);

    const lastUpdated = Date.now();
    const toCache: Array<Promise<string | null>> = [];
    for (const record of transformedResponse) {
      // @ts-expect-error -- Types of record and tenants are incompatible
      // because sequelize maps everything to optional
      const meta: CacheTenantRecord = { record, lastUpdated };
      toCache.push(
        this.connection.cache.set(
          `${record.tenantAccessKey}`,
          JSON.stringify(meta),
        ),
      );
    }

    // Push to cache
    await Promise.all(toCache);
  }
}

/**
 * The records fetched from the DB corresponding to a tenant
 */
export interface TenantRecords {
  /**
   * Private `id` field of a tenant
   */
  id: number;

  /**
   * Public UUID that uniquely identifies a tenant
   */
  publicUuid: string;

  /**
   * Access key that identifies the tenant main access account
   */
  tenantAccessKey: string;

  /**
   * Name of the tenant
   */
  name: string;

  /**
   * Registered email of the user
   */
  email: string;

  /**
   * A tenant must have a company name only then it will considered as a tenant
   */
  companyName: string;

  /**
   * When was this tenant createdAt
   */
  createdAt: string;
}

export type CacheTenantRecord = { record: TenantRecords, lastUpdated: number };
