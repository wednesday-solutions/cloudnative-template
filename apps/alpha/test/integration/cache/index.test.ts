import { faker } from '@faker-js/faker';
import type { Redis } from 'ioredis';
import camelCase from 'lodash/camelCase';
import type { CacheTenantRecord } from '@/cache';
import { MainCacheInstance } from '@/cache';
import { Tenant } from '@/db';
import { mapKeys } from '@/utils';

describe('Main Cache', () => {
  const mockTenantOne = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    password: faker.internet.password(),
    tenantAccessKey: faker.datatype.uuid().split('-').join(''),
  };

  const mockTenantTwo = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    password: faker.internet.password(),
    tenantAccessKey: faker.datatype.uuid().split('-').join(''),
  };

  const mockTenantThree = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    password: faker.internet.password(),
    tenantAccessKey: faker.datatype.uuid().split('-').join(''),
  };

  let mainCache: Redis;
  beforeAll(async () => {
    mainCache = MainCacheInstance.getInstance().connection.cache;

    // Create tenants
    await Tenant.create(mockTenantOne);
    await Tenant.create(mockTenantTwo);
    await Tenant.create(mockTenantThree);
  });

  afterAll(async () => {
    await mainCache.flushall();
    await Tenant.truncate();
  });

  it('successfully caches all the tenants', async () => {
    await MainCacheInstance.getInstance().updateOrGetAllTenantsMeta();

    // Get Tenants from Cache and compare them to mock ones
    const tenantOne: CacheTenantRecord = JSON.parse(
      (await mainCache.get(mockTenantOne.tenantAccessKey))!,
    );
    const tenantTwo: CacheTenantRecord = JSON.parse(
      (await mainCache.get(mockTenantTwo.tenantAccessKey))!,
    );
    const tenantThree: CacheTenantRecord = JSON.parse(
      (await mainCache.get(mockTenantThree.tenantAccessKey))!,
    );

    expect(tenantOne.record.tenantAccessKey).toEqual(
      mockTenantOne.tenantAccessKey,
    );
    expect(tenantTwo.record.tenantAccessKey).toEqual(
      mockTenantTwo.tenantAccessKey,
    );
    expect(tenantThree.record.tenantAccessKey).toEqual(
      mockTenantThree.tenantAccessKey,
    );

    const attributes = [
      'id',
      'public_uuid',
      'name',
      'email',
      'company_name',
      'tenant_access_key',
    ];

    // Get Tenants from DB and compare them to cache
    const tenantOneFromDB = (await Tenant.findOne({
      attributes,
      where: { tenantAccessKey: mockTenantOne.tenantAccessKey },
    }))?.toJSON();
    const tenantTwoFromDB = (await Tenant.findOne({
      attributes,
      where: { tenantAccessKey: mockTenantTwo.tenantAccessKey },
    }))?.toJSON();
    const tenantThreeFromDB = (await Tenant.findOne({
      attributes,
      where: { tenantAccessKey: mockTenantThree.tenantAccessKey },
    }))?.toJSON();

    expect(tenantOneFromDB?.publicUuid).toEqual(mapKeys(tenantOne.record, camelCase).publicUuid);
    expect(tenantTwoFromDB?.publicUuid).toEqual(mapKeys(tenantTwo.record, camelCase).publicUuid);
    expect(tenantThreeFromDB?.publicUuid).toEqual(mapKeys(tenantThree.record, camelCase).publicUuid);
  });
});
