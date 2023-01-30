import type { FastifyInstance } from 'fastify';
import type { GetUserParams, CreateUserBody } from '../../db/models/user/user.schema';
import { $ref } from '../../db/models/user/user.schema';
import { createUser, getUser } from './user.controller';

async function userRoutes(server: FastifyInstance) {
  server.get<{ Params: GetUserParams }>('/:id', {
    schema: {
      params: $ref('getUserParams'),
      response: {
        200: $ref('responseUserSchema'),
      },
    },
  }, getUser);

  server.post<{ Body: CreateUserBody }>('/', {
    schema: {
      body: $ref('createUserSchema'),
      response: {
        201: $ref('responseUserSchema'),
      },
    },
  }, createUser);
}

export default userRoutes;
