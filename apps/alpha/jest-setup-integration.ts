import { databaseInstance } from './test/integration/support';

afterAll(async () => {
  await databaseInstance.close();
});
