import UnprocessableEntity from '@src/errors/unprocessable-entity.error';
import {
  BadRequestError,
  ForbiddenError,
  ERROR_CODES,
  ERROR_STATUS_CODES,
  CustomError,
  InternalServerError,
  NotFoundError,
  NotImplementedError,
  TooManyRequestsError,
  UnauthorizedError,
} from '@src/index';

describe('Errors', () => {
  describe('badRequestError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new BadRequestError('Bad request received!');
      } catch (error) {
        expect(error).toEqual(new Error('Bad request received!'));
        expect((error as CustomError).message).toEqual('Bad request received!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_BAD_REQUEST);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_BAD_REQUEST);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new BadRequestError('Bad request received!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Bad request received!' },
          ]);
        }
      }
    });
  });

  describe('forbiddenError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new ForbiddenError('Forbidden!');
      } catch (error) {
        expect(error).toEqual(new Error('Forbidden!'));
        expect((error as CustomError).message).toEqual('Forbidden!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_FORBIDDEN);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_FORBIDDEN);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new ForbiddenError('Forbidden!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Forbidden!' },
          ]);
        }
      }
    });
  });

  describe('internalServerError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new InternalServerError('Internal Server Error!');
      } catch (error) {
        expect(error).toEqual(new Error('Internal Server Error!'));
        expect((error as CustomError).message).toEqual('Internal Server Error!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERRINT_INTERNAL_SERVER_ERROR);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERRINT_INTERNAL_SERVER_ERROR);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new InternalServerError('Internal Server Error!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Internal Server Error!' },
          ]);
        }
      }
    });
  });

  describe('notFoundError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new NotFoundError('Not Found!');
      } catch (error) {
        expect(error).toEqual(new Error('Not Found!'));
        expect((error as CustomError).message).toEqual('Not Found!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_NOT_FOUND);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_NOT_FOUND);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new NotFoundError('Not Found!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Not Found!' },
          ]);
        }
      }
    });
  });

  describe('notImplementedError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new NotImplementedError('Not Implemented!');
      } catch (error) {
        expect(error).toEqual(new Error('Not Implemented!'));
        expect((error as CustomError).message).toEqual('Not Implemented!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERRINT_NOT_IMPLEMENTED);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERRINT_NOT_IMPLEMENTED);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new NotImplementedError('Not Implemented!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Not Implemented!' },
          ]);
        }
      }
    });
  });

  describe('tooManyRequests', () => {
    it('throws an exception with a message', () => {
      try {
        throw new TooManyRequestsError('Not Implemented!');
      } catch (error) {
        expect(error).toEqual(new Error('Not Implemented!'));
        expect((error as CustomError).message).toEqual('Not Implemented!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_TOO_MANY_REQUESTS);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_TOO_MANY_REQUESTS);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new TooManyRequestsError('Not Implemented!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Not Implemented!' },
          ]);
        }
      }
    });
  });

  describe('unauthorizedError', () => {
    it('throws an exception with a message', () => {
      try {
        throw new UnauthorizedError('Unauthorized!');
      } catch (error) {
        expect(error).toEqual(new Error('Unauthorized!'));
        expect((error as CustomError).message).toEqual('Unauthorized!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_UNAUTHORIZED);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_UNAUTHORIZED);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new UnauthorizedError('Unauthorized!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Unauthorized!' },
          ]);
        }
      }
    });
  });

  describe('unprocessableEntity', () => {
    it('throws an exception with a message', () => {
      try {
        throw new UnprocessableEntity('Unprocessable Entity!');
      } catch (error) {
        expect(error).toEqual(new Error('Unprocessable Entity!'));
        expect((error as CustomError).message).toEqual('Unprocessable Entity!');
        expect((error as CustomError).errorCode).toEqual(ERROR_CODES.ERR_UNPROCESSABLE_ENTITY);
        expect((error as CustomError).statusCode).toEqual(ERROR_STATUS_CODES.ERR_UNPROCESSABLE_ENTITY);
      }
    });

    it('serializes errors and return in a proper structure', () => {
      try {
        throw new UnprocessableEntity('Unprocessable Entity!');
      } catch (error) {
        if (error instanceof CustomError) {
          expect(error.serializeErrors()).toEqual([
            { message: 'Unprocessable Entity!' },
          ]);
        }
      }
    });
  });
});
