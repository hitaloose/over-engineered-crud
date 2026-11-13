import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'
import { Task } from '@/domain/entities/task'

export type GetTaskUsecase = Usecase<GetTaskUsecase.Input, GetTaskUsecase.Output>

export namespace GetTaskUsecase {
  export type Input = Auth & { taskId: string }

  export type Output = { task: Task }
}
