import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { toPublicUser } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'
import { LoginUsecase } from '@/domain/usecases/auth/login-usecase'
import { ZodValidatorMock } from '@/infra/mocks/zod-validator.mock'
import { Controller } from '@/presentation/contracts/controller'
import { LoginController } from '@/presentation/controllers/auth/login-controller'

class LoginUsecaseStub implements LoginUsecase {
  async run(): Promise<LoginUsecase.Output> {
    return { user: toPublicUser(mockUser()), token: 'token' }
  }
}

const makeSut = () => {
  const mockedValidator = new ZodValidatorMock<LoginUsecase.Input>()
  const usecase = new LoginUsecaseStub()
  const sut = new LoginController(mockedValidator, usecase)

  return { sut, mockedValidator, usecase }
}

describe('LoginController', () => {
  it('should run the usecase with the validated body', async () => {
    const { sut, mockedValidator, usecase } = makeSut()
    const validated = { email: faker.internet.email(), password: 'x' }
    vitest.spyOn(mockedValidator, 'run').mockResolvedValueOnce(validated)
    const spy = vitest.spyOn(usecase, 'run')

    await sut.handle({ body: { anything: true } })

    expect(spy).toHaveBeenLastCalledWith(validated)
  })

  it('should reply 200 with user and token', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ body: {} })

    expect(response.statusCode).toBe(Controller.StatusCode.OK)
    expect(response.body).toMatchObject({ token: 'token' })
  })

  it('should propagate validation errors', async () => {
    const { sut, mockedValidator } = makeSut()
    vitest.spyOn(mockedValidator, 'run').mockRejectedValueOnce(new Error('invalid'))

    await expect(sut.handle({ body: {} })).rejects.toThrow('invalid')
  })
})
