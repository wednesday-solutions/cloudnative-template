/**
 * Verify if all the required envs to start database exist
 */
export function verifyDatabaseEnvs() {
  const ENVS = [
    'DB_DIALECT',
    'DB_DATABASE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
  ];

  for (const _ENV_ of ENVS) {
    const value = process.env[_ENV_];
    if (!value) {
      throw new Error(`Expected a value for ${_ENV_} but got ${value}`);
    }
  }
}
