import type { FastifyInstance } from 'fastify';
// import { $ref } from '../../db/models/user/user.schema';

async function userRoutes(server: FastifyInstance) {
  server.get('/', () => {
    return 'Hey there!';
  });
}

export default userRoutes;
