import { MainCache, TenantCache } from './instance';

/**
 * Get connection to main cache, this cache is related to the main
 * ops that relate to managing tenants and storing tenants meta.
 *
 * @returns object containing methods and a redis client
 */
export async function mainCacheConnection() {
  const _conn = new MainCache(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT,
    process.env.REDIS_USER,
    process.env.REDIS_PASSWORD,
  );

  return _conn;
}

export async function tenantCacheConnection(options: TenantRedisOptions) {
  const { thost, tport, tusername, tpassword } = options;

  const _conn = new TenantCache(thost, tport, tusername, tpassword);

  return _conn;
}

interface TenantRedisOptions {
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
