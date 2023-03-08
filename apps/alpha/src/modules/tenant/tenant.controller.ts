import { hash } from 'argon2';
import type { CreateTenantBody } from 'entities-schemas';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from 'fastify-custom-errors';
import isEmpty from 'lodash/isEmpty';
import { QueryTypes } from 'sequelize';
import { v4 } from 'uuid';
import { getMainDBConnection } from '../../db/tenancy/connection';

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
  const mainDbConn = getMainDBConnection();

  const tenantAlreadyExists = mainDbConn.instance.query(
    `
  SELECT
    "id",
    "tenant_access_key"
  FROM "main"."tenants"
  WHERE "email" = :email;
  `.trim(),
    { type: QueryTypes.SELECT, replacements: { email } },
  );

  if (!isEmpty(tenantAlreadyExists)) {
    throw new BadRequestError('This tenant already exists! Please contact your administrator.');
  }

  const tenantAccessKey = v4().split('-').join('');
  const hashedPassword = await hash(password);

  const response = await mainDbConn.instance.query(
    `
    INSERT INTO "main"."tenants" ("name", "company_name", "email", "password", "tenant_access_key") VALUES
    (:name, :company_name, :email, :password, :tenant_access_key);
  `.trim(),
    {
      type: QueryTypes.INSERT,
      replacements: {
        name,
        company_name: companyName,
        email,
        password: hashedPassword,
        tenant_access_key: tenantAccessKey,
      },
    },
  );

  return reply.code(200).send({ data: response });
}
