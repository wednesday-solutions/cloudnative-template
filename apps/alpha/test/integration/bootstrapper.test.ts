import { clearDatabase, databaseInstance } from './support';

describe('bootstrapper', () => {
  beforeAll(async () => {
    await databaseInstance.authenticate();
  });

  afterEach(async () => {
    await clearDatabase(databaseInstance);
  });

  it('foobar', () => {
    expect(1 + 1).toEqual(2);
  });
});
