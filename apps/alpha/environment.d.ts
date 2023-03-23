import type { Dialect } from 'sequelize';

declare global {
  declare const brand: unique symbol;

  type Brand<T, TBrand extends string> = T & {
    [brand]: TBrand,
  };

  /**
   * Password brand type, password are to be explicitly
   * marked "Password" type! Which also means password strings
   * must be casted to "Password" type.
   */
  type Password = Brand<string, 'Password'>;

  /**
   * Any sensitive string that is being exchanged must be marked
   * as "Sensitive" which enforces strict restrictions and lets the
   * developer know that this is sensitive data they are dealing with.
   */
  type SensitiveString = Brand<string, 'SensitiveString'>;

  declare namespace NodeJS {
    interface ProcessEnv {
      // Environments
      NODE_ENV: 'development' | 'qa' | 'production' | 'test';

      // Database
      DB_DIALECT?: Dialect;
      DB_DATABASE?: string;
      DB_HOST?: string;
      DB_PORT?: number;
      DB_USERNAME?: string;
      DB_PASSWORD?: string;

      // Redis
      REDIS_HOST?: string;
      REDIS_PORT?: number;
      REDIS_USER?: string;
      REDIS_PASSWORD?: string;

      PORT?: string;
    }
  }
}
