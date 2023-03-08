import type { SequelizeInstance } from './instance';
import { getMainDBConnection } from './tenancy/connection';

/**
 * Main Database singleton used for storing tenant metadata. This is the core
 * database that concerns itself with details about tenants and other stuff.
 */
export class MainDBInstance {
  /**
   * Instance with connection to the main db
   */
  private static instance: MainDBInstance;

  /**
   * Connection to the MainDB
   *
   * @example
   * ```ts
   * const instance = MainDBInstance.getInstance();
   * await instance.connection.authenticate();
   * ```
   */
  connection: SequelizeInstance;

  private constructor() {
    this.connection = getMainDBConnection();
  }

  /**
   * Get the pre-existing connection to the main database.
   *
   * @returns uninitialized connection to the main db
   */
  static getInstance(): MainDBInstance {
    if (!MainDBInstance.instance) {
      MainDBInstance.instance = new MainDBInstance();
    }

    return MainDBInstance.instance;
  }

  /**
   * Calls the authenticate method on sequelize and verifies connection
   * to the main database.
   */
  async verify() {
    await this.connection.instance.authenticate();
  }
}

// Expose instance and re-export everything sequelize
export * from './instance';
export * from 'sequelize';

// Models
export * from './models/tenant/tenant.model';
export * from './models/user/user.model';
