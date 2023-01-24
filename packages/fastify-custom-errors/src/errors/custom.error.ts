import type { ERROR_CODES, STATUS_CODES } from '@src/types';

/**
 * CustomError will be our main error class which all the other errors
 * are gonna extend from. This class will also force all the other errors
 * to follow a error structure.
 *
 * The following should be how our errors are gonna look like!
 *
 * @example
 * ```json
 * {
 *     statusCode: 400,
 *     errorCode: 'ERR_BAD_REQUEST',
 *     errors: [
 *         { message: 'Name should not be an empty string!', field: 'name' },
 *     ],
 * }
 * ```
 *
 * The errors won't really have the `field` in each of the object that we return.
 * Which also mean the error could also look like this!
 *
 * @example
 * ```json
 * {
 *     statusCode: 400,
 *     errorCode: 'ERR_BAD_REQUEST',
 *     errors: [
 *         { message: 'This is error one!' },
 *         { message: 'This is another error you triggered!' },
 *     ],
 * }
 * ```
 */
abstract class CustomError extends Error {
  /**
   * HTTP Error Code for the request.
   */
  abstract statusCode: STATUS_CODES;

  /**
   * Custom error code notifying the user what the error code is.
   */
  abstract errorCode: ERROR_CODES;

  /**
   * Create a error by passing in a message you need to throw!
   *
   * @param [msg] - error message to throw
   */
  constructor(public msg: string) {
    super(msg);
  }

  /**
   * The errors will have to implement this return type. It will force the errors
   * to only have this structure. This will help with error consistency.
   */
  abstract serializeErrors(): Array<{ message: string, field?: string }>;
}

export default CustomError;
