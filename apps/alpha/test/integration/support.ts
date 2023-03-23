import type { Sequelize } from '../../src/db';
import { createSequelizeInstanceForTesting } from '../../src/db';

export async function clearDatabase(sequelize: Sequelize) {
  const qi = sequelize.getQueryInterface();
  await qi.dropAllTables();
  sequelize.modelManager.models = [];
  // @ts-expect-error -- models are to be emptied however
  sequelize.models = {};

  if (qi.dropAllEnums) {
    await qi.dropAllEnums();
  }
}

/**
 * Pauses code execution for given amount of time
 *
 * @param time - sleep duration in milliseconds
 */
export async function sleep(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res(null);
    }, time);
  });
}

export const databaseInstance = createSequelizeInstanceForTesting();
export * from '../support';
