import type Redis from 'ioredis';

export abstract class RedisCache {
  /**
   * Instance of redis
   */
  abstract cache: Redis;

  /**
   * Host url of the redis instance
   */
  abstract host: string;

  /**
   * Port of the redis instance
   */
  abstract port: number;

  /**
   * Username to authenticate with
   */
  abstract username: string;

  /**
   * Password to authenticate with
   */
  abstract password: string;

  /**
   * Establish connection with redis instance
   * Verification for required params must be done before!
   *
   * @override
   */
  connect() {
    throw new Error('`connect` method was not implemented');
  }
}

export default RedisCache;
