import { QueryRunner } from 'typeorm'

/** Constraint names shared by entities and migrations, so schema diffs stay empty. */
export const constraintNames = {
  userUsernameUnique: 'UQ_user_username',
  userEmailUnique: 'UQ_user_email',
  taskUserIdIndex: 'IDX_task_userId',
  taskUserIdForeignKey: 'FK_task_userId',
}

/**
 * Migrations run against Postgres (dev/prod) and SQLite (tests),
 * so column types and defaults are resolved per driver.
 */
export const dialect = (queryRunner: QueryRunner) => {
  const isPostgres = queryRunner.connection.options.type === 'postgres'

  return {
    isPostgres,
    uuid: isPostgres ? 'uuid' : 'varchar',
    timestamp: isPostgres ? 'timestamp' : 'datetime',
    now: isPostgres ? 'now()' : "datetime('now')",
  }
}
