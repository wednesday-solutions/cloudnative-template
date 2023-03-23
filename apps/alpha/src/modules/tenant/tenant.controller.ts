import { hash } from 'argon2';
import type { CreateTenantBody } from 'entities-schemas';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError } from 'fastify-custom-errors';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';
import { v4 } from 'uuid';
import { Tenant } from '../../db/models/tenant/tenant.model';
import { provisionTenantsBackend } from '../../queue/tenant-jobs.queue';

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
  const { name, companyName, email, password } = request.body;

  const { valid, tname } = _validateTenantName(name);
  if (!valid || !tname) {
    throw new BadRequestError(
      `
    The name property that you've provided is not acceptable! Here are some points that you need to keep in mind while choosing a name!
- Prefer a name without any special characters, does not need to be unique across the application, however this name will be used as your DB Admin!
- Since this will be your DB Admin prefer choosing in a format that could be easier for you to use, i.e. "db_admin"
- You can also provide normal strings that would be automatically be handled, i.e. "Database Admin" will be converted to "database_admin" or "Foo Bar" will be made "foo_bar"
- The Max name that would be taken is upto 12 characters!
- The very first character should NOT be a number or special character! It must be a alphabet!
    `.trim(),
      'name',
    );
  }

  const _tenantAlreadyExists = await Tenant.findOne({
    attributes: ['id', 'tenant_access_key'],
    where: { email },
  });

  const tenantAlreadyExists = _tenantAlreadyExists?.toJSON();
  if (!isEmpty(tenantAlreadyExists)) {
    throw new BadRequestError(
      'This tenant already exists! Please contact your administrator.',
    );
  }

  const tenantAccessKey = v4().split('-').join('');

  // Triggers the background job in a queue, this will provision database
  // resources for this tenant.
  await provisionTenantsBackend({
    name: tname,
    companyName,
    tenantsAccessKey: tenantAccessKey as SensitiveString,
    password: password as Password,
  });
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

  return reply.code(200).send({ data: { ...tenant, dbuser: tname } });
}

/**
 * Validates the name property against some rules
 * to make sure its compatible.
 *
 * @param name - name provided by the tenant
 * @returns valid and the transformed name, false and null if not valid
 */
export function _validateTenantName(name: string): {
  /**
   * Is the provided tenant name valid?
   */
  valid: boolean,

  /**
   * Transformed name of the tenant
   */
  tname: string | null,
} {
  let n = name.trim().toLowerCase();

  if (!n) {
    return { valid: false, tname: null };
  }

  n = snakeCase(n);

  const startChar = n.codePointAt(0)!;
  if (!(startChar > 96 && startChar < 123)) {
    return { valid: false, tname: null };
  }

  return { valid: true, tname: n };
}
