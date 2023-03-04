import { MainCache, TenantCache } from './instance';

/**
 * Get connection to main cache, this cache is related to the main
 * ops that relate to managing tenants and storing tenants meta.
 *
 * @returns object containing methods and a redis client
 */
export function mainCacheConnection() {
  if (!process.env.REDIS_HOST) {
    throw new Error(`Expected 'REDIS_HOST' to be defined but got ${process.env.REDIS_HOST}`);
  }

  if (!process.env.REDIS_PORT) {
    throw new Error(`Expected 'REDIS_PORT' to be defined but got ${process.env.REDIS_PORT}`);
  }

  if (!process.env.REDIS_USER) {
    throw new Error(`Expected 'REDIS_USER' to be defined but got ${process.env.REDIS_USER}`);
  }

  if (!process.env.REDIS_PASSWORD) {
    throw new Error(`Expected 'REDIS_PASSWORD' to be defined but got ${process.env.REDIS_PASSWORD}`);
  }

  return new MainCache(
    process.env.REDIS_HOST,
    Number(process.env.REDIS_PORT),
    process.env.REDIS_USER,
    process.env.REDIS_PASSWORD,
  );
}

/**
 * Create a connection to a tenant's cache
 *
 * @param [options] - connection options for tenant's cache
 * @param [options.thost] - tenant's redis host url
 * @param [options.tport] - tenant's redis port
 * @param [options.tusername] - tenant's redis username to authenticate with
 * @param [options.tpassword] - tenant's redis password to authenticate with
 * @returns connection to a tenant's cache
 */
export function tenantCacheConnection(options: TenantRedisOptions) {
  const { thost, tport, tusername, tpassword } = options;

  return new TenantCache(thost, tport, tusername, tpassword);
}

export interface TenantRedisOptions {
  /**
   * Tenant's redis host url
   */
  thost: string;

  /**
   * Tenant's redis port
   */
  tport: number;

  /**
   * Tenant's redis username to authenticate with
   */
  tusername: string;

  /**
   * Tenant's redis password to authenticate with
   */
  tpassword: string;
}
