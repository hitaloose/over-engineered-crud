import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

import { dialect } from '@/infra/libs/typeorm/migrations/helpers'

export class CreateTask1731456000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const { uuid, timestamp, now } = dialect(queryRunner)

    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          { name: 'id', type: uuid, isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'userId', type: uuid },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', default: "'todo'" },
          { name: 'dueDate', type: timestamp, isNullable: true },
          { name: 'createdAt', type: timestamp, default: now },
          { name: 'updatedAt', type: timestamp, default: now },
        ],
      })
    )

    await queryRunner.createIndex('task', new TableIndex({ name: 'IDX_task_userId', columnNames: ['userId'] }))

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({ columnNames: ['userId'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'CASCADE' })
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task')
  }
}
