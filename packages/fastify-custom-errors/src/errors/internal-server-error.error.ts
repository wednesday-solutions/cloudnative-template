import { ERROR_CODES, ERROR_STATUS_CODES } from '@src/types';
import CustomError from './custom.error';

/**
 * Your typical 500 Internal Server Error, something went wrong internally
 */
class InternalServerError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERRINT_INTERNAL_SERVER_ERROR;
  errorCode = ERROR_CODES.ERRINT_INTERNAL_SERVER_ERROR;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default InternalServerError;
