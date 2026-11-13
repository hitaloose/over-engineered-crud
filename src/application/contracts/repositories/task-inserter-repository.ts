import { BaseEntity } from '@/domain/entities/base-entity'
import { Task } from '@/domain/entities/task'

export interface TaskInserterRepository {
  insert(values: Omit<Task, keyof BaseEntity>): Promise<Task>
}
