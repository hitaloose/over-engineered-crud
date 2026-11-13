import 'reflect-metadata'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { dataSource } from '@/infra/libs/typeorm/config'

const tableNames = async () => {
  const rows: { name: string }[] = await dataSource.query("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('user', 'task')")

  return rows.map((row) => row.name).sort()
}

describe('migrations (integration)', () => {
  beforeAll(async () => {
    await dataSource.initialize()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('should run every migration on boot', async () => {
    expect(await dataSource.showMigrations()).toBe(false)
    expect(await tableNames()).toEqual(['task', 'user'])
  })

  it('should match the entity metadata (no pending schema changes)', async () => {
    const sqlInMemory = await dataSource.driver.createSchemaBuilder().log()

    expect(sqlInMemory.upQueries.map((query) => query.query)).toEqual([])
  })

  it('should revert cleanly and re-apply', async () => {
    await dataSource.undoLastMigration()
    expect(await tableNames()).toEqual(['user'])

    await dataSource.undoLastMigration()
    expect(await tableNames()).toEqual([])

    await dataSource.runMigrations()
    expect(await tableNames()).toEqual(['task', 'user'])
  })
})
