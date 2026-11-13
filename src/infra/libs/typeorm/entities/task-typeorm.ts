import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Task, TaskStatus } from '@/domain/entities/task'

@Entity({ name: 'task' })
export class TaskTypeorm implements Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'varchar' })
  userId!: string

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
