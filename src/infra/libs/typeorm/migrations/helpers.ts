import { QueryRunner } from 'typeorm'

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
    now: isPostgres ? 'now()' : "(datetime('now'))",
  }
}
