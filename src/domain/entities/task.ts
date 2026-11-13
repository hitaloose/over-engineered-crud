import { BaseEntity } from '@/domain/entities/base-entity'

export const TASK_STATUSES = ['todo', 'doing', 'done'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export type Task = BaseEntity & {
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: Date | null
}
