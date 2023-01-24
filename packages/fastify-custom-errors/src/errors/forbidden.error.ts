import { ERROR_CODES, ERROR_STATUS_CODES } from '@src/types';
import CustomError from './custom.error';

/**
 * Forbidden resource was requested and will not be served.
 */
class ForbiddenError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_FORBIDDEN;
  errorCode = ERROR_CODES.ERR_FORBIDDEN;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default ForbiddenError;
