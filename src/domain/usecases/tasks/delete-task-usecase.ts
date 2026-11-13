import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'

export type DeleteTaskUsecase = Usecase<DeleteTaskUsecase.Input, DeleteTaskUsecase.Output>

export namespace DeleteTaskUsecase {
  export type Input = Auth & { taskId: string }

  export type Output = void
}
