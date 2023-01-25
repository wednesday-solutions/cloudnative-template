import type { Dialect } from 'sequelize';

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      // Environments
      NODE_ENV: 'development' | 'qa' | 'production' | 'test';

      // Database
      DB_DIALECT: Dialect;
      DB_DATABASE: string;
      DB_HOST: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
    }
  }
}
