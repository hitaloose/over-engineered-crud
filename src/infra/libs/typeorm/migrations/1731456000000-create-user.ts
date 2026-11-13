import { MigrationInterface, QueryRunner, Table } from 'typeorm'

import { constraintNames, dialect } from '@/infra/libs/typeorm/migrations/helpers'

export class CreateUser1731456000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const { isPostgres, uuid, timestamp, now } = dialect(queryRunner)

    if (isPostgres) {
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    }

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: uuid, isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar' },
          { name: 'username', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'hashedPassword', type: 'varchar' },
          { name: 'createdAt', type: timestamp, default: now },
          { name: 'updatedAt', type: timestamp, default: now },
        ],
        uniques: [
          { name: constraintNames.userUsernameUnique, columnNames: ['username'] },
          { name: constraintNames.userEmailUnique, columnNames: ['email'] },
        ],
      })
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user')
  }
}
