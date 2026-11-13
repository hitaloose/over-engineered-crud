import { Task } from '@/domain/entities/task'

export interface TaskUpdaterRepository {
  update(id: string, values: TaskUpdaterRepository.Values): Promise<Task>
}

export namespace TaskUpdaterRepository {
  export type Values = Partial<Pick<Task, 'title' | 'description' | 'status' | 'dueDate'>>
}
