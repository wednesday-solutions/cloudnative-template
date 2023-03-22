import { MainCacheInstance } from '@/cache';
import { MainDBInstance } from '@/db';
import { databaseInstance } from './test/integration/support';

afterAll(async () => {
  jest.resetAllMocks();
  await databaseInstance.close();
  await MainDBInstance.getInstance().connection.instance.close();

  await _clearCache();

  await MainCacheInstance.getInstance().connection.dropConnection();
});

async function _clearCache() {
  await MainCacheInstance.getInstance().connection.cache.flushall();
}
