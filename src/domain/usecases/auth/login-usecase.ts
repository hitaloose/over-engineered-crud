import { Usecase } from '@/domain/contracts/usecase'
import { PublicUser } from '@/domain/entities/user'

export type LoginUsecase = Usecase<LoginUsecase.Input, LoginUsecase.Output>

export namespace LoginUsecase {
  export type Input = { email: string; password: string }

  export type Output = { user: PublicUser; token: string }
}
