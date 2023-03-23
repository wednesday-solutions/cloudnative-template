import { faker } from '@faker-js/faker';
import { MainCache } from '@/cache/instance/main';

describe('MainCache', () => {
  let redisClient: MainCache;

  beforeEach(async () => {
    redisClient = new MainCache(
      process.env.REDIS_HOST!,
      Number(process.env.REDIS_PORT!),
      process.env.REDIS_PASSWORD!,
    );

    await redisClient.connect();
  });

  afterEach(async () => {
    await redisClient.quit();
  });

  it('is capable of setting records and fetching them', async () => {
    const k = faker.random.word();
    const v = faker.random.word();

    await redisClient.cache.set(k, v);
    const result = await redisClient.cache.get(k);

    expect(result).toEqual(v);
  });
});
