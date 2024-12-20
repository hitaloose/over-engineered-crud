import { Usecase } from '@/domain/contracts/usecase'
import { BaseEntity } from '@/domain/entities/base-entity'
import { User } from '@/domain/entities/user'

export type RegisterUserUsecase = Usecase<RegisterUserUsecase.Input, RegisterUserUsecase.Output>

export namespace RegisterUserUsecase {
  export type Input = Omit<User, keyof BaseEntity | 'hashedPassword'> & { password: string; passwordConfirmation: string }

  export type Output = { user: User; token: string }
}
