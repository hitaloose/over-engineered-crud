import { User } from '@/domain/entities/user'
import { GenericUsecase } from '@/domain/usecases/generic-usecase'

export type RegisterUserUsecase = GenericUsecase<RegisterUserUsecase.Input, RegisterUserUsecase.Output>

export namespace RegisterUserUsecase {
  export type Input = Omit<User, 'id' | 'hashedPassword'> & { password: string; passwordConfirmation: string }

  export type Output = { user: User }
}
