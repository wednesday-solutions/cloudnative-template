import Redis from 'ioredis';
import RedisCache from './abstract';

/**
 * Cache for the main connection, this will be used for maintaining all
 * the required stuff from the main db straight in the cache.
 */
export class MainCache extends RedisCache {
  cache: Redis;

  /**
   * Setup redis, by default we'll have lazyConnect to true,
   * which means to connect to your instance use the `connect` method!
   *
   * @param [host] - redis host url
   * @param [port] - port of the running redis instance
   * @param [password] - password to authenticate with
   * @param [username] - username to authenticate with
   */
  constructor(
    public host: string,
    public port: number,
    public password: string,
    public username?: string,
  ) {
    super();

    this.cache = new Redis({
      host: this.host,
      port: this.port,
      username: this.username ?? undefined,
      password: this.password,
      lazyConnect: true,
    });
  }

  /**
   * Establish connection to the redis instance
   */
  async connect() {
    await this.cache.connect();
  }

  /**
   * Disconnects from the redis instance handling all the pending requests
   * first and then gracefully dropping the connection
   */
  async quit() {
    await this.cache.quit();
  }

  /**
   * Disconnect from the instance, this will drop all the pending
   * requests, prefer using `quit` method instead
   */
  async dropConnection() {
    this.cache.disconnect();
  }

  async shutdown() {
    await new Promise<void>(resolve => {
      void this.cache.quit(() => {
        resolve();
      });
    });
    // redis.quit() creates a thread to close the connection.
    // We wait until all threads have been run once to ensure the connection closes.
    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setImmediate(resolve));
  }
}

export default MainCache;
