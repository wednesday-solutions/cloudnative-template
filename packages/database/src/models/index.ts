import { SequelizeInstance } from '../core';
import { verifyDatabaseEnvs } from '../utils';

if (process.env.NODE_ENV !== 'test') {
  verifyDatabaseEnvs();
}

const db = new SequelizeInstance(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
  },
);

export const { instance } = db;
export default instance;
