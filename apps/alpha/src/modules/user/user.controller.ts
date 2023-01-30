import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserBody, GetUserParams } from 'src/db/models/user/user.schema';

/**
 * Get user based on the id provided
 *
 * @param [request] - FastifyRequest
 * @param [reply] - FastifyReply
 */
export async function getUser(request: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
  return reply.send(`Hey there ${request.params.id}`);
}

/**
 * Create a user based on the data provided
 *
 * @param [request] - FastifyRequest
 * @param [reply] - FastifyReply
 */
export async function createUser(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
  return reply.send(`Created user ${request.body.name}`);
}
