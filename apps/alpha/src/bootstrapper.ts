import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { CustomError } from 'fastify-custom-errors';
import type { FastifyBootstrapperOptions } from './types/bootstrapper.types';

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
   * @param [options.port] - the port on which the application should listen, defaults to 5000
   * @param [options.host] - the host on which the application should run, defaults to `localhost`
   * @param [options.logging] - should log output, defaults to `false`
   * @param [options.routes] - array containing object specifying a route and its prefix
   */
  constructor(public options: FastifyBootstrapperOptions) {
    this.instance = fastify({ logger: options.logging ?? false });

    this.#registerRoutes();
    this.#setupErrorHandler();
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
    await this.instance.listen({ port: this.options.port ?? 5000, host: this.options.host ?? 'localhost' });
  }

  /**
   * Registers routes provided to the bootstrapper. HealthCheck route
   * is created by default at `/healthcheck` by the bootstrapper.
   */
  #registerRoutes() {
    const routes = this.options.routes ?? [];

    // Register Health Check
    this.instance.get('/health-check', async () => {
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
    this.instance.setErrorHandler((error, _request, reply) => {
      this.instance.log.error(error);
      if (error instanceof CustomError) {
        void reply
          .status(error.statusCode)
          .send({ ok: false, errCode: error.errorCode, errors: error.serializeErrors() });
      } else {
        void reply.status(500).send({ errCode: 500, errors: error });
      }
    });
  }
}

export default FastifyServer;
