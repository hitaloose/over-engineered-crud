import { Auth } from '@/domain/contracts/auth'
import { Usecase } from '@/domain/contracts/usecase'
import { PublicUser } from '@/domain/entities/user'

export type GetMeUsecase = Usecase<GetMeUsecase.Input, GetMeUsecase.Output>

export namespace GetMeUsecase {
  export type Input = Auth

  export type Output = { user: PublicUser }
}
