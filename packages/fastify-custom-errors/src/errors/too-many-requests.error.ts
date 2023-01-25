import { ERROR_CODES, ERROR_STATUS_CODES } from '../types';
import CustomError from './custom.error';

/**
 * Rate limiting, too many requests were sent by the client.
 */
class TooManyRequestsError extends CustomError {
  statusCode = ERROR_STATUS_CODES.ERR_TOO_MANY_REQUESTS;
  errorCode = ERROR_CODES.ERR_TOO_MANY_REQUESTS;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export default TooManyRequestsError;
