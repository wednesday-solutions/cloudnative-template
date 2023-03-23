import { MainCacheInstance } from '@/cache';
import { MainDBInstance } from '@/db';
import { databaseInstance } from './test/integration/support';

afterAll(async () => {
  await databaseInstance.close();
  await MainDBInstance.getInstance().connection.instance.close();

  await _clearCacheAndDropConnection();
});

async function _clearCacheAndDropConnection() {
  await MainCacheInstance.getInstance().connection.cache.flushall();
  await MainCacheInstance.getInstance().connection.shutdown();
}
