import FastifyServer from '@src/bootstrapper';
import type { Sequelize } from 'fastify-postgres-database';

/**
 * Test server which extends the original server and can contain
 * more methods for debugging!
 */
export class TestFastifyServer extends FastifyServer {
  /**
   * Closes the server will also fire the `onClose` hook
   */
  async closeServer() {
    await this.instance.close();
  }
}

export async function clearDatabase(sequelize: Sequelize) {
  const qi = sequelize.getQueryInterface();
  await qi.dropAllTables();
  sequelize.modelManager.models = [];
  // @ts-expect-error -- models are to be emptied however
  sequelize.models = {};

  if (qi.dropAllEnums) {
    qi.dropAllEnums();
  }
}
