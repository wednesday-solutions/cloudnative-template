import FastifyServer from '@src/bootstrapper';
import type { FastifyInstance } from 'fastify';
import { NotImplementedError } from 'fastify-custom-errors';
import { TestFastifyServer } from '../support';

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

  it('handles errors thrown by CustomError\'s instances and serializes them in correct structure', async () => {
    async function userRoutes(router: FastifyInstance) {
      router.get('/', async () => {
        throw new NotImplementedError('The following is not implemented yet!');
      });
    }

    const _server = new FastifyServer({ routes: [{ handler: userRoutes, opts: { prefix: '/user' } }] });
    const response = await _server.instance.inject({
      method: 'GET',
      url: '/user',
    });

    expect(response.json()).toEqual({
      ok: false,
      errCode: '[FASTIFY:API]:ERRINT_NOT_IMPLEMENTED',
      errors: [{ message: 'The following is not implemented yet!' }],
    });
  });

  it('handles errors thrown by Errors aside of CustomError\'s instances and serializes them in correct structure', async () => {
    async function userRoutes(router: FastifyInstance) {
      router.get('/', async () => {
        throw new Error('Not a CustomError!');
      });
    }

    const _server = new FastifyServer({ routes: [{ handler: userRoutes, opts: { prefix: '/user' } }] });
    const response = await _server.instance.inject({
      method: 'GET',
      url: '/user',
    });

    expect(response.json()).toEqual({
      ok: false,
      errCode: 500,
      errors: [{ message: 'Something went wrong!' }],
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
    const _server = new TestFastifyServer({ port: 9000 });
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

    await _server.closeServer();
    try {
      await _server.instance.inject();
    } catch (error) {
      expect(error).toEqual(new Error('Server is closed'));
    }
  });

  it('starts a server on default port of 5000 if no port was provided', async () => {
    const _server = new TestFastifyServer({});
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

    await _server.closeServer();
    try {
      await _server.instance.inject();
    } catch (error) {
      expect(error).toEqual(new Error('Server is closed'));
    }
  });
});
