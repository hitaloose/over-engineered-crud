import { faker } from '@faker-js/faker'

import { toPublicUser } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'
import { RegisterUserUsecase } from '@/domain/usecases/auth/register-user-usecase'

export class RegisterUserUsecaseMock implements RegisterUserUsecase {
  async run(): Promise<RegisterUserUsecase.Output> {
    return { user: toPublicUser(mockUser()), token: faker.string.uuid() }
  }
}
