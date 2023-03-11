import { hash } from 'argon2';
import type { CreateTenantBody } from 'entities-schemas';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from 'fastify-custom-errors';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { v4 } from 'uuid';
import { Tenant } from '../../db/models/tenant/tenant.model';

/**
 * Create and register a new tenant with the system
 *
 * @param [request] - FastifyRequest
 * @param [reply] - FastifyReply
 */
export async function registerTenant(
  request: FastifyRequest<{ Body: CreateTenantBody }>,
  reply: FastifyReply,
) {
  // @TODO - Once a tenant is successfully registered we need to create a db for them
  const { name, companyName, email, password } = request.body;

  const _tenantAlreadyExists = await Tenant.findOne({ attributes: ['id', 'tenant_access_key'], where: { email } });
  const tenantAlreadyExists = _tenantAlreadyExists?.toJSON();
  if (!isEmpty(tenantAlreadyExists)) {
    throw new BadRequestError('This tenant already exists! Please contact your administrator.');
  }

  const tenantAccessKey = v4().split('-').join('');
  const hashedPassword = await hash(password);

  const _tenant = await Tenant.create({
    name,
    companyName,
    email,
    password: hashedPassword,
    tenantAccessKey,
  });

  const tenant = cloneDeep(_tenant.toJSON());

  // @ts-expect-error -- 'tenant.password' is required while creating but should not be in response
  delete tenant.password;
  delete tenant.id;

  return reply.code(200).send({ data: tenant });
}
