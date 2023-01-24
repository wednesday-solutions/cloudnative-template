import { ERROR_CODES, ERROR_STATUS_CODES } from '@src/types';
import CustomError from './custom.error';

/**
 * The requested resource was not found!
 */
class NotFoundError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_NOT_FOUND;
  errorCode = ERROR_CODES.ERR_NOT_FOUND;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default NotFoundError;
