import {
  generateInvalidSchemaTypeError,
  generateRequiredSchemaTypeError,
} from '@/db/utils';

describe('DBUtils', () => {
  describe('generateRequiredSchemaTypeError', () => {
    it('throws if the required argument was not provided', () => {
      expect(() => generateRequiredSchemaTypeError('')).toThrow(
        'Argument `field` was not provided!',
      );
    });

    it('generates a formatted message for required argument', () => {
      const message = generateRequiredSchemaTypeError('name');
      expect(message).toEqual('name is required!');
    });
  });

  describe('generateInvalidSchemaTypeError', () => {
    it('throws if the required argument field was not provided', () => {
      expect(() => generateInvalidSchemaTypeError('', '')).toThrow(
        'Argument `field` was not provided!',
      );
    });

    it('throws if the required argument type was not provided', () => {
      expect(() => generateInvalidSchemaTypeError('name', '')).toThrow(
        'Argument `type` was not provided!',
      );
    });

    it('generates a formatted message for required argument', () => {
      const message = generateInvalidSchemaTypeError('name', 'string');
      expect(message).toEqual('Field name must be a string');
    });
  });
});
