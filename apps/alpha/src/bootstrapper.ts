import path from 'node:path';
import autoload from '@fastify/autoload';
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
   * @param [options.schemas] - array containing schemas to register
   */
  constructor(public options: FastifyBootstrapperOptions) {
    this.instance = fastify({ logger: options.logging ?? false });

    this.#registerSchemas();
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
    await this.instance.listen({
      port: this.options.port ?? 5000,
      host: this.options.host ?? 'localhost',
    });
  }

  /**
   * Register schemas provided by the user, warn the user if no schemas were provided.
   */
  #registerSchemas() {
    if (!this.options.schemas || this.options.schemas.length === 0) {
      this.instance.log.warn(
        'No schemas were provided, you may not have type checking for schema dependent things.',
      );

      return;
    }

    for (const schemaDef of this.options.schemas) {
      for (const _schema of schemaDef) {
        this.instance.addSchema(_schema);
      }
    }
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

    // Autoload all the `*.routes.ts` file that exist inside the `modules` dir
    void this.instance.register(autoload, {
      dir: path.join(__dirname, 'modules'),
      indexPattern: /.*routes.ts$/,
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
        /**
         * First let's clarify what the above condition is, its essentially this
         * ```js
         * (error.validation[0].schemaPath).startsWith('Schema');
         * ```
         * The way its written above in the condition is failsafe because what if the
         * property `validation` is not present? Or `error` itself is undefined or anything.
         * That would result into a `TypeError` the failsafe method above makes sure that
         * doesn't happen.
         *
         * If this error occurs then it means it came from a Zod Schema validation failure
         * which can be handled in the way down below.
         *
         * TODO: These errors should be easily handled by doing `error instanceof z.ZodError`
         *       however, the above is returning false because it is somewhere in between being
         *       converted. This needs to be fixed so as to reduce complexity here!
         */
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
}

export default FastifyServer;
