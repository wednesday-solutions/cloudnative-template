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
   * Assigned by default and should NOT be passed uniquely identifies the user
   */
  id: z.number(),

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
 * Definition showing how a user if read and returned to the client would look like!
 */
const responseUserSchema = z.object({
  ...userSchemaCore,
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  responseUserSchema,
});

export type UserAttributes = z.infer<typeof createUserSchema>;
