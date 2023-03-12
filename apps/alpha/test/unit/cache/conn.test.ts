import { mainCacheConnection } from '@/cache/conn';

describe('Redis Conn', () => {
  describe('mainCacheConnection', () => {
    it('throws if rhost was not passed', () => {
      expect(() => mainCacheConnection('')).toThrow(
        `Expected 'REDIS_HOST' to be defined but got`,
      );
    });

    it('throws if rport was not passed', () => {
      expect(() => mainCacheConnection('test_host')).toThrow(
        `Expected 'REDIS_PORT' to be defined but got`,
      );
    });

    it('throws if rpassword was not passed', () => {
      expect(() => mainCacheConnection('test_host', 1234)).toThrow(
        `Expected 'REDIS_PASSWORD' to be defined but got`,
      );
    });
  });
});
