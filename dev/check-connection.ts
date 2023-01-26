import { createSequelizeInstanceForTesting } from '../packages/database/src/core/instance';

const sequelize = createSequelizeInstanceForTesting();

(async () =>{
  await sequelize.authenticate();
  await sequelize.close();

  console.info('Connected to integration testing DB successfully!');
})();
