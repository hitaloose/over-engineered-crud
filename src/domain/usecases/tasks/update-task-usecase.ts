import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'
import { Task, TaskStatus } from '@/domain/entities/task'

export type UpdateTaskUsecase = Usecase<UpdateTaskUsecase.Input, UpdateTaskUsecase.Output>

export namespace UpdateTaskUsecase {
  export type Input = Auth & {
    taskId: string
    title?: string
    description?: string | null
    status?: TaskStatus
    dueDate?: Date | null
  }

  export type Output = { task: Task }
}
