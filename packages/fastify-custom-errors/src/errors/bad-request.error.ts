import { ERROR_CODES, ERROR_STATUS_CODES } from '@src/types';
import CustomError from './custom.error';

/**
 * If the user sends any invalid data or something that doesn't
 * comply with what was expected.
 */
class BadRequestError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_BAD_REQUEST;
  errorCode = ERROR_CODES.ERR_BAD_REQUEST;

  constructor(public message: string, public field: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field }];
  }
}

export default BadRequestError;
