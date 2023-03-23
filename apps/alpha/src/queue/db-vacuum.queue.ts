import Queue from 'bull';
import { MainDBInstance } from '../db';

/**
 * Vacuum's the Database with main connection, the vacuum done here
 * will skip locked relations therefore any table with exclusive locks
 * WILL BE SKIPPED!
 */
export async function vacuumSkipLockedRelations() {
  const skipLockedVacuumRepeatedJob = new Queue<{ metadata: VACUUM_TYPE }>(
    `db-vacuum-queue:vacuuming-all-relations-skipping-locked-${Date.now()}`,
    {
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: process.env.REDIS_PORT,
      },
    },
  );

  await skipLockedVacuumRepeatedJob.add({ metadata: VACUUM_TYPE.SKIP_LOCKED }, {
    repeat: {
      cron: '0 0 * * 0',
    },
  });

  void skipLockedVacuumRepeatedJob.process(async job => {
    const { data: { metadata } } = job;
    const connectionToMainDatabase = MainDBInstance.getInstance().connection.instance;

    if (metadata === VACUUM_TYPE.SKIP_LOCKED) {
      await connectionToMainDatabase.query(`VACUUM (SKIP_LOCKED);`);
    }
  });
}

/**
 * All types of Vacuum's that we support
 */
enum VACUUM_TYPE {
  /**
   * Skip all the relations which have an active exclusive lock
   */
  SKIP_LOCKED = 'SKIP_LOCKED',
}
