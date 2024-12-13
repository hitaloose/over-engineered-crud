import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { RegisterUserUsecaseMock } from '@/application/mocks/register-user-usecase.mock'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'
import { ZodValidatorMock } from '@/infra/mocks/zod-validator.mock'
import { Controller } from '@/presentation/contracts/controller'
import { RegisterUserController } from '@/presentation/controllers/register-user-controller'

const makeSut = () => {
  const mockedBodyValidator = new ZodValidatorMock<RegisterUserUsecase.Input>()
  const mockedRegisterUserUsecase = new RegisterUserUsecaseMock()

  const sut = new RegisterUserController(mockedBodyValidator, mockedRegisterUserUsecase)
  return { sut, mockedBodyValidator, mockedRegisterUserUsecase }
}

const makeRequest = (): Controller.Request => {
  const password = faker.internet.password()

  return {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.username(),
      password,
      passwordConfirmation: password,
    },
  }
}

describe('RegisterUserController', () => {
  it('should call bodyValidator with correct values', async () => {
    const { sut, mockedBodyValidator } = makeSut()

    const spy = vitest.spyOn(mockedBodyValidator, 'run')

    const request = makeRequest()
    await sut.handle(request)

    expect(spy).toHaveBeenLastCalledWith(request.body)
  })
})
