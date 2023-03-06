import { UserSchema } from 'entities-schemas';
import type { GetUserParams, CreateUserBody } from 'entities-schemas';
import type { FastifyInstance } from 'fastify';
import { buildJsonSchemas } from 'fastify-zod';
import { createUser, getUser } from './user.controller';

const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema: UserSchema.createUserSchema,
  getUserParams: UserSchema.getUserParams,
  responseUserSchema: UserSchema.responseUserSchema,
}, { $id: 'user-schemas' });

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

export { userSchemas };
export default userRoutes;
