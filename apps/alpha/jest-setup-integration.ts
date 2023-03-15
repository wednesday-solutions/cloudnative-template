import { MainCacheInstance } from '@/cache';
import { MainDBInstance } from '@/db';
import { databaseInstance } from './test/integration/support';

afterAll(async () => {
  await databaseInstance.close();
  await MainDBInstance.getInstance().connection.instance.close();
  await MainCacheInstance.getInstance().connection.dropConnection();
});
