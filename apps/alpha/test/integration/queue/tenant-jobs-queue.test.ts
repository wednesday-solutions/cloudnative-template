import { faker } from '@faker-js/faker';
import type { Sequelize } from '@/db';
import { MainDBInstance } from '@/db';
import { Tenant } from '@/db/models/tenant/tenant.model';
import { getTenantDBConnection } from '@/db/tenancy/tenant-db-connection';
import { provisionTenantsBackend } from '@/queue/tenant-jobs.queue';
import { sleep } from '../support';

describe('tenants queues', () => {
  const mockTenantData = {
    name: faker.name.firstName().toLowerCase(),
    companyName: faker.company.name().toLowerCase(),
    password: faker.internet.password() as Password,
    tenantsAccessKey: faker.datatype.uuid().split('-').join('') as SensitiveString,
  };

  let mainDb: Sequelize;
  beforeAll(() => {
    mainDb = MainDBInstance.getInstance().connection.instance;
  });

  afterAll(async () => {
    await Tenant.truncate();
    await mainDb.query(`DROP DATABASE "${mockTenantData.tenantsAccessKey}";`);
    await mainDb.query(`DROP USER "${mockTenantData.name}";`);
  });

  it('provisions and creates resources for tenant', async () => {
    await Tenant.create({
      id: Number(faker.random.numeric()),
      name: mockTenantData.name,
      companyName: mockTenantData.companyName,
      email: faker.internet.email(),
      password: mockTenantData.password,
      tenantAccessKey: mockTenantData.tenantsAccessKey,
    });

    await provisionTenantsBackend(mockTenantData);

    await sleep(5000);

    const tenantsConnection = await getTenantDBConnection(
      mockTenantData.tenantsAccessKey,
      mockTenantData.name.toLocaleLowerCase(),
      mockTenantData.password,
    );

    await tenantsConnection.instance.authenticate();
    await tenantsConnection.instance.close();
  });
});
