import FastifyServer from '@src/bootstrapper';
import type { FastifyInstance } from 'fastify';

describe('bootstrapper', () => {
  let server: FastifyServer;
  beforeEach(() => {
    server = new FastifyServer({});
  });

  it('creates a `/healthcheck` route without any explicit declarations', async () => {
    const response = await server.instance.inject({
      method: 'GET',
      url: '/health-check',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.statusMessage).toEqual('OK');
    expect(response.json()).toEqual({
      message: 'Fastify just being fast!',
      status: 'Ok!',
    });
  });

  it('is able to create a route that is passed in the routes array', async () => {
    async function userRoutes(router: FastifyInstance) {
      router.get('/', async () => {
        return { user: 'frostzt' };
      });
    }

    const _server = new FastifyServer({ routes: [{ handler: userRoutes, opts: { prefix: '/user' } }] });
    const response = await _server.instance.inject({
      method: 'GET',
      url: '/user',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.statusMessage).toEqual('OK');
    expect(response.json()).toEqual({
      user: 'frostzt',
    });
  });

  it('starts a server on a certain provided port', async () => {
    class TestFastifyServer extends FastifyServer {
      constructor() {
        super({ port: 9000 });
      }

      async stopServer() {
        await this.instance.close();
      }
    }

    const _server = new TestFastifyServer();
    await _server.startServer();

    const response = await _server.instance.inject({
      method: 'GET',
      url: '/health-check',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.statusMessage).toEqual('OK');
    expect(response.json()).toEqual({
      message: 'Fastify just being fast!',
      status: 'Ok!',
    });

    await _server.stopServer();
    try {
      await _server.instance.inject();
    } catch (error) {
      expect(error).toEqual(new Error('Server is closed'));
    }
  });

  it('starts a server on default port of 5000 if no port was provided', async () => {
    class TestFastifyServer extends FastifyServer {
      constructor() {
        super({});
      }

      async stopServer() {
        await this.instance.close();
      }
    }

    const _server = new TestFastifyServer();
    await _server.startServer();

    const response = await _server.instance.inject({
      method: 'GET',
      url: '/health-check',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.statusMessage).toEqual('OK');
    expect(response.json()).toEqual({
      message: 'Fastify just being fast!',
      status: 'Ok!',
    });

    await _server.stopServer();
    try {
      await _server.instance.inject();
    } catch (error) {
      expect(error).toEqual(new Error('Server is closed'));
    }
  });
});
