import fs from 'node:fs';
import path from 'node:path';
import { Umzug, SequelizeStorage } from 'umzug';
import { createSequelizeInstanceForTesting } from './src/db/instance';

// This file is used to migrate the integration test DB to latest the moment you spin it up!
(async () => {
  console.info(`Migrating the integration testing database to latest!
DB Configurations`);

  const sequelize = createSequelizeInstanceForTesting();

  const mainMigrator = new Umzug({
    migrations: {
      glob: ['./migrations/main/*.sql', { cwd: __dirname }],
      resolve(params) {
        const downPath = path.join(
          path.dirname(params.path!),
          'down',
          path.basename(params.path!),
        );

        return {
          name: params.name,
          path: params.path,
          up: async () => params.context.query(fs.readFileSync(params.path!).toString()),
          down: async () => params.context.query(fs.readFileSync(downPath).toString()),
        };
      },
    },
    storage: new SequelizeStorage({
      sequelize,
      modelName: 'SequelizeMeta',
      schema: 'public',
    }),
    context: sequelize,
    logger: console,
  });

  await mainMigrator.up();
})();
