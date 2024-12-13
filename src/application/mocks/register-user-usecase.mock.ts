import { mockUser } from '@/domain/mocks/user.mock'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'

export class RegisterUserUsecaseMock implements RegisterUserUsecase {
  async run(): Promise<RegisterUserUsecase.Output> {
    return { user: mockUser() }
  }
}
