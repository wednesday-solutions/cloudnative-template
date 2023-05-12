import { faker } from '@faker-js/faker';
import { ERROR_CODES } from 'fastify-custom-errors';
import { MainCacheInstance } from '@/cache';
import { Tenant } from '@/db/models/tenant/tenant.model';
import * as tenantQueue from '@/queue/tenant-jobs.queue';
import { server } from '@/server';

describe('Tenant module', () => {
  beforeEach(() => {
    // @TODO -- Find a better way to run Bull with integration tests
    // We need to mock bull because it runs on a separate thread which also
    // means that its possible that all the tests complete but the process
    // kept going and probably requested for resources that no longer exist
    // for example, Databases and Cache!
    jest.spyOn(tenantQueue, 'provisionTenantsBackend').mockImplementation();
  });

  describe('TenantController#registerTenant', () => {
    afterEach(async () => {
      await Tenant.truncate();
      await MainCacheInstance.getInstance().connection.cache.flushall();
    });

    it('successfully registers a new tenant', async () => {
      const randomTenant = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        companyName: faker.company.name(),
        password: faker.random.alphaNumeric(8),
      };

      const response: any = await server.instance.inject({
        method: 'POST',
        url: '/alpha/tenant',
        payload: randomTenant,
      });

      const body = JSON.parse(response.body);

      expect(body.data.publicUuid).toBeDefined();
      expect(body.data.tenantAccessKey).toBeDefined();

      const isItThere = await Tenant.findOne({
        where: { tenantAccessKey: body.data.tenantAccessKey },
      });
      const existingDBResponse = isItThere?.toJSON();

      expect(existingDBResponse?.name).toEqual(randomTenant.name);
      expect(existingDBResponse?.email).toEqual(randomTenant.email);
      expect(existingDBResponse?.companyName).toEqual(randomTenant.companyName);
    });

    it('throws if the tenant already exists', async () => {
      const randomTenant = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        companyName: faker.company.name(),
        password: faker.random.alphaNumeric(8),
      };

      await server.instance.inject({
        method: 'POST',
        url: '/alpha/tenant',
        payload: randomTenant,
      });

      const response: any = await server.instance.inject({
        method: 'POST',
        url: '/alpha/tenant',
        payload: randomTenant,
      });

      const responseParsed = JSON.parse(response.body);

      expect(responseParsed.errCode).toEqual(ERROR_CODES.ERR_BAD_REQUEST);
      expect(responseParsed.errors[0].message).toBe(
        'This tenant already exists! Please contact your administrator.',
      );
    });
  });
});
