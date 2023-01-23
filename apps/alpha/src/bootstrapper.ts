import type { FastifyInstance, FastifyRegisterOptions } from 'fastify';
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
  readonly instance: FastifyInstance;

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
   * @param [options.routes] - array containing object specifying a route and its prefix
   */
  constructor(public options: FastifyBootstrapperOptions) {
    this.instance = fastify({ logger: options.logging ?? false });

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
    await this.instance.listen({ port: this.options.port, host: this.options.host ?? 'localhost' });
  }

  /**
   * Registers routes provided to the bootstrapper. HealthCheck route
   * is created by default at `/healthcheck` by the bootstrapper.
   */
  #registerRoutes() {
    const routes = this.options.routes ?? [];

    // Register Health Check
    this.instance.get('/healthcheck', async () => {
      return { status: 'Ok!', message: 'Fastify just being fast!' };
    });

    for (const _route of routes) {
      void this.instance.register(_route.handler, _route.opts);
    }
  }

  /**
   * Setup global Error Handler.
   */
  #setupErrorHandler() {
    // TODO: Setup Error handler and error handling structure.
  }
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
   * Pino as a logger is built into Fastify itself. Setting this will
   * allow you to do the following!
   *
   * @example
   * ```typescript
   * fastify.log('Foobar');
   *
   * // or in the route
   * request.log('Fizzbuzz');
   * ```
   */
  logging?: boolean;

  /**
   * Array containing all the routes defined in the application.
   * These will be registered by the bootstrapper. A Health-Check route
   * is automatically created at `/healthcheck`!
   */
  routes?: RouteConfig[];
}

type RouteConfig = {
  /**
   * Handler that handles this route
   */
  handler(): void,

  /**
   * FastifyRegisterOptions taken in by route configurations
   */
  opts: FastifyRegisterOptions<{ prefix: string }>,
};
