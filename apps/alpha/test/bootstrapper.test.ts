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
});
