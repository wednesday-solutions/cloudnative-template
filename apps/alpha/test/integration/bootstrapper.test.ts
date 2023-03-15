import type { FastifyInstance } from 'fastify';
import type { Model, ModelStatic } from '../../src/db';
import { DataTypes } from '../../src/db';
import { databaseInstance, TestFastifyServer } from './support';

describe('bootstrapper', () => {
  let User: ModelStatic<Model<any, any>>;
  let server: TestFastifyServer;

  beforeAll(async () => {
    async function userRoutes(router: FastifyInstance) {
      router.get<{ Params: { id: number } }>('/:id', async request => {
        const foundUser = await User.findOne({
          where: { id: request.params.id },
        });

        return foundUser;
      });

      router.post<{ Body: { name: string } }>('/', async request => {
        const newUser = await User.create({ name: request.body.name });

        return newUser;
      });
    }

    server = new TestFastifyServer({
      port: 5001,
      routes: [
        { handler: userRoutes, opts: { prefix: '/integration-test-route' } },
      ],
    });
  });

  beforeEach(async () => {
    await databaseInstance.authenticate();

    User = databaseInstance.define(
      'test_user',
      { name: DataTypes.STRING },
      { timestamps: false, freezeTableName: true },
    );
    await databaseInstance.sync({ force: true });
  });

  afterEach(async () => {
    await databaseInstance.getQueryInterface().dropTable('test_user');
  });

  afterAll(async () => {
    await server.closeServer();
  });

  it('handles creating a user from the endpoint and later fetch it', async () => {
    const responseForCreateUser = await server.instance.inject({
      method: 'POST',
      url: '/integration-test-route',
      payload: {
        name: 'Sourav',
      },
    });

    expect(responseForCreateUser.statusCode).toEqual(200);
    expect(responseForCreateUser.statusMessage).toEqual('OK');
    expect(responseForCreateUser.json()).toEqual({
      id: 1,
      name: 'Sourav',
    });

    const responseForGetUser = await server.instance.inject({
      method: 'GET',
      url: '/integration-test-route/1',
    });

    expect(responseForGetUser.statusCode).toEqual(200);
    expect(responseForGetUser.statusMessage).toEqual('OK');
    expect(responseForGetUser.json()).toEqual({
      id: 1,
      name: 'Sourav',
    });
  });
});
