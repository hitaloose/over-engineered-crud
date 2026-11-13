import { faker } from '@faker-js/faker'

import { AuthenticateUsecase } from '@/domain/usecases/auth/authenticate-usecase'

export class AuthenticateUsecaseMock implements AuthenticateUsecase {
  async run(): Promise<AuthenticateUsecase.Output> {
    return { userId: faker.string.uuid() }
  }
}
