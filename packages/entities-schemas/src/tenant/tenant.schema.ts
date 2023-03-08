import { z } from 'zod';
import {
  generateInvalidSchemaTypeError,
  generateRequiredSchemaTypeError,
} from '../utils';

const tenantSchemaCore = {
  /**
   * Name of the tenant
   */
  name: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('name', 'string'),
    required_error: generateRequiredSchemaTypeError('name'),
  }),

  /**
   * A UUID for the tenant that can be exposed publically to uniquely identify the tenant
   */
  publicUuid: z.string().optional(),

  /**
   * When was this tenant created
   */
  createdAt: z.date().optional(),

  /**
   * When was the tenant last updated, `undefined` if never updated
   */
  updatedAt: z.date().optional(),

  /**
   * Email of the tenant, should be unique
   */
  email: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('email', 'string'),
    required_error: generateRequiredSchemaTypeError('email'),
  }),

  /**
   * Company name
   */
  companyName: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('companyName', 'string'),
    required_error: generateRequiredSchemaTypeError('companyName'),
  }),
};

const tenentAccessKey = {
  /**
   * Tenant access key indentifies the tenant which the tenant users can use
   * to uniquely identify which tenant they belong to
   */
  tenantAccessKey: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('tenantAccessKey', 'string'),
  }).optional(),
};

const createTenantSchema = z.object({
  ...tenantSchemaCore,

  /**
   * Password of the user
   */
  password: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('password', 'string'),
    required_error: generateRequiredSchemaTypeError('password'),
  }),
});

const createTenantResponse = z.object({
  ...tenantSchemaCore,
  ...tenentAccessKey,
});

const TenantEntitySchema = z.object({
  /**
   * Primary key for the DB uniquely identifying a tenant
   */
  id: z.number().optional(),

  /**
   * Password of the tenant
   */
  password: z.string({
    invalid_type_error: generateInvalidSchemaTypeError('password', 'string'),
    required_error: generateRequiredSchemaTypeError('password'),
  }),
  ...tenantSchemaCore,
  ...tenentAccessKey,
});

export const TenantSchema = {
  tenantSchemaCore,
  createTenantSchema,
  TenantEntitySchema,
  createTenantResponse,
};

export type TenantAttributes = z.infer<typeof TenantEntitySchema>;
export type CreateTenantBody = z.infer<typeof createTenantSchema>;
