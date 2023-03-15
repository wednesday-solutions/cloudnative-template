import type { FastifyInstance, FastifyRegisterOptions } from 'fastify';
import fastify from 'fastify';
import { CustomError } from 'fastify-custom-errors';

type RouteConfig = {
  /**
   * Handler that handles this route
   */
  handler(server: FastifyInstance): Promise<void>,

  /**
   * FastifyRegisterOptions taken in by route configurations
   */
  opts: FastifyRegisterOptions<{ prefix: string }>,
};

interface TestServerOpts {
  port: number;
  host: string;
  logging: boolean;
  routes: RouteConfig[];
}

export class TestFastifyServer {
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
  constructor(public options: Partial<TestServerOpts>) {
    this.instance = fastify({ logger: options.logging ?? false });

    this.#registerRoutes();
    this.#setErrorHandler();
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
    await this.instance.listen({
      port: this.options.port ?? 5000,
      host: this.options.host ?? 'localhost',
    });
  }

  /**
   * Registers routes provided to the bootstrapper and auto-register if present.
   * HealthCheck route is created by default at `/healthcheck` by the bootstrapper.
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

  #setErrorHandler() {
    this.instance.setErrorHandler((error, _request, reply) => {
      if (error instanceof CustomError) {
        // These are errors that we know we have handled through our
        // own error handling logic!
        void reply.status(error.statusCode).send({
          ok: false,
          errCode: error.errorCode,
          errors: error.serializeErrors(),
        });
      } else if (
        (
          ((((error as any) || {}).validation || [])[0] || {})
            .schemaPath || ''
        ).startsWith('Schema')
      ) {
        void reply.status(400).send({
          ok: false,
          errCode: '[FASTIFY:API]:SCHEMA_VALIDATION_ERROR',
          errors: [{ message: error.message }],
        });
      } else {
        // Handle all the errors that are unexpected and unforeseen
        // the error should be logged here!
        this.instance.log.error(error);

        void reply.status(500).send({
          ok: false,
          errCode: 500,
          errors: [{ message: 'Something went wrong!' }],
        });
      }
    });
  }

  /**
   * Closes the server will also fire the `onClose` hook
   */
  async closeServer() {
    await this.instance.close();
  }
}
