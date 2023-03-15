import cloneDeep from 'lodash/cloneDeep';
import { getMainDBConnection } from '@/db/tenancy/main-db-connection';

describe('Tenancy Connection', () => {
  /**
   * This is a typical way to assigning and reassgning envs so that you
   * can check your env branch checks. Do note the following:
   *
   * @example
   * ```ts
   * process.env.FOO = undefined;
   * ```
   *
   * The above won't work since that sets `FOO` to `'undefined'` which
   * is a string! Therefore its better to set it to an empty string (`''`).
   */
  describe('getMainDBConnection', () => {
    const currentEnvs = cloneDeep(process.env);

    beforeEach(() => {
      process.env.DB_DATABASE = 'TEST_DB';
      process.env.DB_USERNAME = 'TEST_USER';
      process.env.DB_PASSWORD = 'TEST_PASS';
    });

    afterEach(() => {
      process.env = currentEnvs;
    });

    it('throws if `DB_DATABASE` env was not set', () => {
      process.env.DB_DATABASE = '';

      expect(() => getMainDBConnection()).toThrowError(
        'Expected `DB_DATABASE` to be defined but was not set!',
      );
    });

    it('throws if `DB_USERNAME` env was not set', () => {
      process.env.DB_USERNAME = '';

      expect(() => getMainDBConnection()).toThrowError(
        'Expected `DB_USERNAME` to be defined but was not set!',
      );
    });

    it('throws if `DB_PASSWORD` env was not set', () => {
      process.env.DB_PASSWORD = '';

      expect(() => getMainDBConnection()).toThrowError(
        'Expected `DB_PASSWORD` to be defined but was not set!',
      );
    });
  });
});
