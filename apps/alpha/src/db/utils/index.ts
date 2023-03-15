/**
 * Create and generate errors that are consistent with other db errors
 * for required database fields.
 *
 * @param [field] - field that is required
 * @returns Error string that is consistent with other same errors!
 */
export function generateRequiredSchemaTypeError(field: string) {
  if (!field.trim()) {
    throw new Error('Argument `field` was not provided!');
  }

  return `${field} is required!`;
}

/**
 * Create and generate errors that are consistent with other db errors
 * for invalid field type.
 *
 * @param [field] - field that is required
 * @param [type] - expected type of the field
 * @returns Error string that is consistent with other same errors!
 */
export function generateInvalidSchemaTypeError(field: string, type: string) {
  if (!field.trim()) {
    throw new Error('Argument `field` was not provided!');
  }

  if (!type.trim()) {
    throw new Error('Argument `type` was not provided!');
  }

  return `Field ${field} must be a ${type}`;
}
