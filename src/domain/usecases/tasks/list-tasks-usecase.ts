import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'
import { Task, TaskStatus } from '@/domain/entities/task'

export type ListTasksUsecase = Usecase<ListTasksUsecase.Input, ListTasksUsecase.Output>

export namespace ListTasksUsecase {
  export type Input = Auth & {
    status?: TaskStatus
    page: number
    perPage: number
  }

  export type Output = {
    tasks: Task[]
    total: number
    page: number
    perPage: number
  }
}
