import { Usecase } from '@/domain/contracts/usecase'
import { User } from '@/domain/entities/user'

export type RegisterUserUsecase = Usecase<RegisterUserUsecase.Input, RegisterUserUsecase.Output>

export namespace RegisterUserUsecase {
  export type Input = Omit<User, 'id' | 'hashedPassword'> & { password: string; passwordConfirmation: string }

  export type Output = { user: User }
}
