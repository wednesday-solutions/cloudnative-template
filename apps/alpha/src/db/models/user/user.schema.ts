import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';
import {
  generateInvalidSchemaTypeError,
  generateRequiredSchemaTypeError,
} from '../../utils';

/**
 * Core construct of the User entity!
 */
const userSchemaCore = {
  /**
   * Name of the user to be inserted into the database
   */
  name: z.string({
    required_error: generateRequiredSchemaTypeError('name'),
    invalid_type_error: generateInvalidSchemaTypeError('name', 'string'),
  }),

  /**
   * Email of the user to be inserted into the database, must be unique
   */
  email: z.string({
    required_error: generateRequiredSchemaTypeError('email'),
    invalid_type_error: generateInvalidSchemaTypeError('email', 'string'),
  }),

  /**
   * To which tenant does this user belong to
   */
  belongsToTenant: z.number({
    required_error: generateRequiredSchemaTypeError('belongsToTenant'),
    invalid_type_error: generateInvalidSchemaTypeError('belongsToTenant', 'number'),
  }),
};

/**
 * Definition showing how a user should be constructed and what properties will the
 * construct have!
 */
const createUserSchema = z.object({
  ...userSchemaCore,

  /**
   * Password provided by the user which will be encrypted and stored into the db
   */
  password: z.string({
    required_error: generateRequiredSchemaTypeError('email'),
    invalid_type_error: generateInvalidSchemaTypeError('email', 'string'),
  }),
});

/**
 * Param validation for fetching the user in getUser request
 */
const getUserParams = z.object({
  id: z.number({
    required_error: generateRequiredSchemaTypeError('id'),
    invalid_type_error: generateInvalidSchemaTypeError('id', 'number'),
  }),
});

/**
 * Definition showing how a user if read and returned to the client would look like!
 */
const responseUserSchema = z.object({
  ...userSchemaCore,
  /**
   * A UUID for the tenant that can be exposed publically to uniquely identify the tenant
   */
  publicUuid: z.string(),
});

const UserEntitySchema = z.object({
  ...userSchemaCore,
  /**
   * Assigned by default and should NOT be passed uniquely identifies the user
   */
  id: z.number(),

  /**
   * A UUID for the tenant that can be exposed publically to uniquely identify the tenant
   */
  publicUuid: z.string(),

  /**
   * Password provided by the user which will be encrypted and stored into the db
   */
  password: z.string({
    required_error: generateRequiredSchemaTypeError('email'),
    invalid_type_error: generateInvalidSchemaTypeError('email', 'string'),
  }),

  /**
   * When was this user created
   */
  createdAt: z.date(),

  /**
   * When was the user last updated, `undefined` if never updated
   */
  updatedAt: z.date(),
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  responseUserSchema,
  getUserParams,
});

export type GetUserParams = z.infer<typeof getUserParams>;
export type UserAttributes = z.infer<typeof UserEntitySchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
