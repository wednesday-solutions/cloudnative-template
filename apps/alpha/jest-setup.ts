import { clearDatabase, databaseInstance } from './test/integration/support';

afterAll(async () => {
  await clearDatabase(databaseInstance);
  await databaseInstance.close();
});
