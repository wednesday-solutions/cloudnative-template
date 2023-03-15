import { faker } from '@faker-js/faker';
import type { CacheTenantRecord } from '@/cache';
import { MainCacheInstance } from '@/cache';
import { DataTypes, MainDBInstance, Tenant } from '@/db';
import { getTenantDBConnection } from '@/db/tenancy/tenant-db-connection';

describe('DB Connection', () => {
  const alphaCreds = { user: 'alpha_admin', pass: 'alpha_password_123' };
  const mockAlphaTenantAccessKey = faker.datatype.uuid().split('-').join('');
  const mockAlphaTenant = {
    id: Number(faker.random.numeric()),
    publicUuid: faker.datatype.uuid(),
    tenantAccessKey: mockAlphaTenantAccessKey,
    name: faker.internet.userName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    createdAt: new Date().toDateString(),
  };

  const betaCreds = { user: 'beta_admin', pass: 'beta_password_123' };
  const mockBetaTenantAccessKey = faker.datatype.uuid().split('-').join('');
  const mockBetaTenant = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    password: faker.internet.password(),
    tenantAccessKey: mockBetaTenantAccessKey,
  };

  beforeAll(async () => {
    const mainDB = MainDBInstance.getInstance().connection;
    const mainCache = MainCacheInstance.getInstance().connection.cache;

    // Cached tenant
    const cachedAlphaTenantRecord: CacheTenantRecord = {
      record: mockAlphaTenant,
      lastUpdated: Date.now(),
    };

    await mainCache.set(
      mockAlphaTenantAccessKey,
      JSON.stringify(cachedAlphaTenantRecord),
    );

    // Tenant not cached
    await Tenant.create(mockBetaTenant);

    // Create extra databases and their admin users
    await mainDB.instance.query(
      `CREATE DATABASE "${mockAlphaTenantAccessKey}";`,
    );
    await mainDB.instance.query(
      `CREATE DATABASE "${mockBetaTenantAccessKey}";`,
    );

    // NOTE: THESE TWO STATEMENTS ARE ONLY FOR INTEGRATION TESTING AND SHOULD NEVER BE USED IN REAL SCENARIO
    await mainDB.instance.query(
      `CREATE ROLE "${alphaCreds.user}" WITH LOGIN SUPERUSER PASSWORD '${alphaCreds.pass}'`,
    );
    await mainDB.instance.query(
      `CREATE ROLE "${betaCreds.user}" WITH LOGIN SUPERUSER PASSWORD '${betaCreds.pass}'`,
    );
  });

  afterAll(async () => {
    const mainDB = MainDBInstance.getInstance().connection;

    await Tenant.truncate();
    await mainDB.instance.query(`DROP DATABASE "${mockAlphaTenantAccessKey}";`);
    await mainDB.instance.query(`DROP DATABASE "${mockBetaTenantAccessKey}";`);
    await mainDB.instance.query(`DROP USER "${alphaCreds.user}";`);
    await mainDB.instance.query(`DROP USER "${betaCreds.user}";`);

    await MainCacheInstance.getInstance().connection.cache.flushall();
  });

  it('gets tenent from main db if cache miss and is capable of creating records in that DB', async () => {
    const conn = await getTenantDBConnection(
      mockBetaTenantAccessKey,
      betaCreds.user,
      betaCreds.pass,
    );

    await conn.instance.authenticate();
    const User = conn.instance.define(
      'user',
      { name: { type: DataTypes.TEXT } },
      { timestamps: false },
    );

    const mockUserName = faker.internet.userName();
    await conn.instance.sync({ force: true });
    await User.create({ name: mockUserName });

    const _fetchedUser = await User.findOne({ where: { name: mockUserName } });
    const fetchedUser = _fetchedUser?.toJSON();

    expect(fetchedUser.name).toEqual(mockUserName);

    await conn.instance.close();
  });

  it('gets a cache hit fetches the creds and is then capable to create records in the respective DB', async () => {
    const conn = await getTenantDBConnection(
      mockAlphaTenantAccessKey,
      alphaCreds.user,
      alphaCreds.pass,
    );

    await conn.instance.authenticate();
    const User = conn.instance.define(
      'user',
      { name: { type: DataTypes.TEXT } },
      { timestamps: false },
    );

    const mockUserName = faker.internet.userName();
    await conn.instance.sync({ force: true });
    await User.create({ name: mockUserName });

    const _fetchedUser = await User.findOne({ where: { name: mockUserName } });
    const fetchedUser = _fetchedUser?.toJSON();

    expect(fetchedUser.name).toEqual(mockUserName);

    await conn.instance.close();
  });

  it('throws if no tenant was found', async () => {
    const nonExistentAccessKey = faker.datatype.uuid().split('-').join('');

    void expect(
      getTenantDBConnection(
        nonExistentAccessKey,
        faker.internet.userName(),
        faker.internet.password(),
      ),
    ).rejects.toThrow('Invalid credentials!');
  });
});
