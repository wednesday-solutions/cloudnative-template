import { MainCache } from './instance';

/**
 * Get connection to main cache, this cache is related to the main
 * ops that relate to managing tenants and storing tenants meta.
 *
 * @param [rhost] - redis host
 * @param [rport] - redis port
 * @param [rpassword] - redis password
 * @param [ruser] - redis user
 * @returns object containing methods and a redis client
 */
export function mainCacheConnection(
  rhost?: string,
  rport?: number,
  rpassword?: string,
  ruser?: string,
) {
  if (!rhost) {
    throw new Error(`Expected 'REDIS_HOST' to be defined but got ${rhost}`);
  }

  if (!rport) {
    throw new Error(`Expected 'REDIS_PORT' to be defined but got ${rport}`);
  }

  if (!rpassword) {
    throw new Error(
      `Expected 'REDIS_PASSWORD' to be defined but got ${rpassword}`,
    );
  }

  return new MainCache(rhost, rport, rpassword, ruser);
}
