import { Task, TaskStatus } from '@/domain/entities/task'

export interface TaskListerRepository {
  list(input: TaskListerRepository.Input): Promise<TaskListerRepository.Output>
}

export namespace TaskListerRepository {
  export type Input = {
    userId: string
    status?: TaskStatus
    offset: number
    limit: number
  }

  export type Output = { tasks: Task[]; total: number }
}
