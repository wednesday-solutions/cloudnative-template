/**
 * Error codes that we'll be using to debug the application.
 */
export enum ERROR_CODES {
  /**
   * 400 Bad Request - The user didn't send proper payload or data
   */
  ERR_BAD_REQUEST = '[FASTIFY:API]:ERR_BAD_REQUEST',
}

/**
 * HTTP Error Codes that we have! Make sure to augment this for more error codes.
 * MUST contain only HTTP Error codes.
 */
export enum STATUS_CODES {
  /**
   * 400 Bad Request - The user didn't send proper payload or data
   */
  ERR_BAD_REQUEST = 400,
}
