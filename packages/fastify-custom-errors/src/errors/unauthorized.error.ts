import { ERROR_CODES, ERROR_STATUS_CODES } from '../types';
import CustomError from './custom.error';

/**
 * The user is not allowed or will probably require authentication
 */
class UnauthorizedError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_UNAUTHORIZED;
  errorCode = ERROR_CODES.ERR_UNAUTHORIZED;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default UnauthorizedError;
