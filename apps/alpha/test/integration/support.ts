import type { Sequelize } from 'fastify-postgres-database';
import { createSequelizeInstanceForTesting } from 'fastify-postgres-database';

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

export const databaseInstance = createSequelizeInstanceForTesting();
export * from '../support';
