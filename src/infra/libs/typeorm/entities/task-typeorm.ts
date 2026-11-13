import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Task, TaskStatus } from '@/domain/entities/task'
import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'
import { constraintNames } from '@/infra/libs/typeorm/migrations/helpers'

@Entity({ name: 'task' })
export class TaskTypeorm implements Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index(constraintNames.taskUserIdIndex)
  @Column({ type: 'varchar' })
  userId!: string

  /** Only declared so the foreign key is part of the entity metadata; never loaded or returned. */
  @ManyToOne(() => UserTypeorm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: constraintNames.taskUserIdForeignKey })
  user?: UserTypeorm

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar', default: 'todo' })
  status!: TaskStatus

  @Column({ type: Date, nullable: true })
  dueDate!: Date | null

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
