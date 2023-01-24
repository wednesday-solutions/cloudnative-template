import { ERROR_CODES, ERROR_STATUS_CODES } from '@src/types';
import CustomError from './custom.error';

/**
 * The client requested a resource or method that the server doesn't support yet
 */
class NotImplementedError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERRINT_NOT_IMPLEMENTED;
  errorCode = ERROR_CODES.ERRINT_NOT_IMPLEMENTED;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default NotImplementedError;
