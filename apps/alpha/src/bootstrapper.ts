import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';

/**
 * Quickly instantiate a Fastify Server. This class will quickly generate a
 * fastify server that will setup all the necessary logic required for the application
 * to work.
 */
export class FastifyServer {
  /**
   * Instance of fastify server!
   */
  readonly server: FastifyInstance;

  /**
   * Setup the fastify server!
   *
   * @example
   * ```typescript
   * // Without host and logging, logging defaults to `false` and host to `localhost`
   * const server = new FastifyServer({ port: 5000 });
   *
   * // With host and logging
   * const server = new FastifyServer({ port: 5000, logging: true, host: '0.0.0.0' });
   * ```
   *
   * @param [options] - options for FastifyBootstrapper
   * @param [options.port] - the port on which the application should listen, is required
   * @param [options.host] - the host on which the application should run, defaults to `localhost`
   * @param [options.logging] - should log output, defaults to `false`
   */
  constructor(public options: FastifyBootstrapperOptions) {
    this.server = fastify({ logger: options.logging ?? false });

    this.#registerRoutes();
  }

  /**
   * Don't call this function in the constructor. Rather this is here for extensability
   * which means the server doesn't start automatically! Rather its upto the user to start it.
   *
   * If you want to extend functionality its not recommended to directly modify this class rather
   * recommended to extend this function and use that to extend functionality. Post that call the
   * `startServer` method!
   *
   * @example
   * ```typescript
   * class ExtendedFastifyServer extends FastifyServer {
   *  constructor() {
   *    super({ fastifyServerOptions });
   *  }
   *
   *  yourExtraMethod() {
   *    // Logic
   *  }
   * }
   *
   * const server = new ExtendedFastifyServer();
   * void server.startServer();
   * ```
   */
  async startServer() {
    return this.server.listen({ port: this.options.port, host: this.options.host ?? 'localhost' });
  }

  /**
   * Registers routes provided to the bootstrapper.
   */
  #registerRoutes() {}

  #setupErrorHandler() {}
}

export default FastifyServer;

/**
 * Options for FastifyBootstrapper
 */
interface FastifyBootstrapperOptions {
  /**
   * Port the application should listen on, is required!
   */
  port: number;

  /**
   * Host the application should run on, defaults to `localhost`
   */
  host?: string;

  /**
   * Option forwarded to `fastify.logger`, defaults to `false`
   */
  logging?: boolean;
}
