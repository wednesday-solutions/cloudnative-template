import type { ModelDefined, Optional } from '../../index';
import { DataTypes, dbConnection } from '../../index';
import type { TenantAttributes } from './tenant.schema';

type TenantCreationAttributes = Optional<TenantAttributes, 'id'>;

/**
 * Tenant Entity in the database represents a tenant, more of a company that will
 * have their own database!
 */
export const Tenant: ModelDefined<TenantCreationAttributes, TenantAttributes>
  = dbConnection.instance.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      // Generated by default using postgres modules
      publicUuid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        field: 'public_uuid',
      },
      tenantAccesskey: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tenant_access_key',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'company_name',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    { schema: 'main', tableName: 'tenants', timestamps: false },
  );

export default Tenant;
