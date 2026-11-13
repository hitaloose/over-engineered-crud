import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'
import { Task, TaskStatus } from '@/domain/entities/task'

export type CreateTaskUsecase = Usecase<CreateTaskUsecase.Input, CreateTaskUsecase.Output>

export namespace CreateTaskUsecase {
  export type Input = Auth & {
    title: string
    description?: string | null
    status?: TaskStatus
    dueDate?: Date | null
  }

  export type Output = { task: Task }
}
