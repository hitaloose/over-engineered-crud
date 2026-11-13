import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'

export type AuthenticateUsecase = Usecase<AuthenticateUsecase.Input, AuthenticateUsecase.Output>

export namespace AuthenticateUsecase {
  export type Input = { token: string }

  export type Output = Auth
}
