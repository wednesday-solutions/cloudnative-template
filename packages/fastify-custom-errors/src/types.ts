/**
 * Error codes that we'll be using to debug the application.
 */
export enum ERROR_CODES {
  /**
   * 400 Bad Request - The user didn't send proper payload or data
   */
  ERR_BAD_REQUEST = '[FASTIFY:API]:ERR_BAD_REQUEST',

  /**
   * 401 Unauthorized - The requested resource is unauthorized to be accessed by this client
   */
  ERR_UNAUTHORIZED = '[FASTIFY:API]:ERR_UNAUTHORIZED',

  /**
   * 403 Forbidden - The requested resource is forbidden to be accessed by this client
   */
  ERR_FORBIDDEN = '[FASTIFY:API]:ERR_FORBIDDEN',

  /**
   * 404 Not Found - The requested resource was not found
   */
  ERR_NOT_FOUND = '[FASTIFY:API]:ERR_NOT_FOUND',

  /**
   * 422 Unprocessable Entity - The payload received had semantic errors
   */
  ERR_UNPROCESSABLE_ENTITY = '[FASTIFY:API]:ERR_UNPROCESSABLE_ENTITY',

  /**
   * 429 Too Many Requests - The client has sent too many requests in a given amount of time
   */
  ERR_TOO_MANY_REQUESTS = '[FASTIFY:API]:ERR_TOO_MANY_REQUESTS',

  /**
   * 500 Internal Server Error - The server encountered situation it can't handle
   */
  ERRINT_INTERNAL_SERVER_ERROR = '[FASTIFY:API]:ERRINT_INTERNAL_SERVER_ERROR',

  /**
   * 501 Not Implemented - The request is not supported by the server
   */
  ERRINT_NOT_IMPLEMENTED = '[FASTIFY:API]:ERRINT_NOT_IMPLEMENTED',
}

/**
 * HTTP Error Codes that we have! Make sure to augment this for more error codes.
 * MUST contain only HTTP Error codes.
 */
export enum ERROR_STATUS_CODES {
  /**
   * 400 Bad Request - The client didn't send proper payload or data
   */
  ERR_BAD_REQUEST = 400,

  /**
   * 401 Unauthorized - The requested resource is unauthorized to be accessed by this client
   */
  ERR_UNAUTHORIZED = 401,

  /**
   * 403 Forbidden - The requested resource is forbidden to be accessed by this client
   */
  ERR_FORBIDDEN = 403,

  /**
   * 404 Not Found - The requested resource was not found
   */
  ERR_NOT_FOUND = 404,

  /**
   * 422 Unprocessable Entity - The payload received had semantic errors
   */
  ERR_UNPROCESSABLE_ENTITY = 422,

  /**
   * 429 Too Many Requests - The client has sent too many requests in a given amount of time
   */
  ERR_TOO_MANY_REQUESTS = 429,

  /**
   * 500 Internal Server Error - The server encountered situation it can't handle
   */
  ERRINT_INTERNAL_SERVER_ERROR = 500,

  /**
   * 501 Not Implemented - The request is not supported by the server
   */
  ERRINT_NOT_IMPLEMENTED = 501,
}
