import { ERROR_CODES, ERROR_STATUS_CODES } from '../types';
import CustomError from './custom.error';

/**
 * The payload/data sent was semantically incorrect.
 */
class UnprocessableEntity extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_UNPROCESSABLE_ENTITY;
  errorCode = ERROR_CODES.ERR_UNPROCESSABLE_ENTITY;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default UnprocessableEntity;
