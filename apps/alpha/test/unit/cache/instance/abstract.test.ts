import type { Redis } from 'ioredis';
import { RedisCache } from '@/cache/instance/abstract';

describe('RedisAbstractCache', () => {
  it('throws if new cache is created without overriding connect method', () => {
    class GooglesCache extends RedisCache {
      username = 'test_username';
      password = 'test_password';
      cache = jest.fn() as unknown as Redis;
      host = 'test_host';
      port = 4040;
    }

    const cacheHost1 = new GooglesCache();
    expect(() => cacheHost1.connect()).toThrow('`connect` method was not implemented');
  });
});
