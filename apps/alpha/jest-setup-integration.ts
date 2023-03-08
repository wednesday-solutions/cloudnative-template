import { databaseInstance } from './test/integration/support';
import { MainDBInstance } from '@/db';

afterAll(async () => {
  await databaseInstance.close();
  await MainDBInstance.getInstance().connection.instance.close();
});
