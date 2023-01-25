import type { ModelDefined, Optional } from '@core';
import { DataTypes } from '@core';
import { instance } from '..';
import type { UserAttributes } from './user.schema';

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export const User: ModelDefined<UserCreationAttributes, UserAttributes>
  = instance.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'users' },
  );

export default User;
