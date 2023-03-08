import { v4 } from 'uuid';
import { Tenant } from '@/db/models/tenant/tenant.model';

describe('TenantModel', () => {
  afterEach(async () => {
    await Tenant.truncate();
  });

  it('generates a tenant which can then be fetched from the DB', async () => {
    const tak = v4().split('-').join('');

    await Tenant.create({
      name: 'Wednesday',
      companyName: 'Wednesday Solutions',
      tenantAccessKey: tak,
      email: 'test@wednesday.is',
      password: 'mockPassword',
    });

    const _wednesdayRaw = await Tenant.findOne({ where: { tenantAccessKey: tak } });
    const wednesday = _wednesdayRaw?.toJSON();

    expect(wednesday!.name).toBe('Wednesday');
    expect(wednesday!.companyName).toBe('Wednesday Solutions');
    expect(wednesday!.tenantAccessKey).toBe(tak);
    expect(wednesday!.publicUuid?.trim()).toBeDefined();
  });
});
