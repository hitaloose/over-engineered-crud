import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { HasherMock } from '@/application/mocks/hasher.mock'
import { UserRepositoryMock } from '@/application/mocks/user-repository.mock'
import { RegisterUserUsecaseImpl } from '@/application/usecases/register-user-usecase-impl'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'

const makeSut = () => {
  const mockedHasher = new HasherMock()
  const mockedUserRepository = new UserRepositoryMock()

  const sut = new RegisterUserUsecaseImpl(mockedHasher, mockedUserRepository, mockedUserRepository)

  return { sut, mockedHasher, mockedUserRepository }
}

const makeInput = (override?: Partial<RegisterUserUsecase.Input>): RegisterUserUsecase.Input => {
  const password = faker.internet.password()

  return {
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
    ...override,
  }
}

describe('RegisterUserUsecaseImpl', () => {
  it('should throw if password not match', async () => {
    const { sut } = makeSut()

    const promise = sut.run(makeInput({ password: 'password', passwordConfirmation: 'not match password' }))

    await expect(promise).rejects.toThrow('passwords not match')
  })

  it('should call user finder with correct values', async () => {
    const { sut, mockedUserRepository } = makeSut()

    const spy = vitest.spyOn(mockedUserRepository, 'findByNameUsernameOrEmail')

    const input = makeInput()
    await sut.run(input)

    expect(spy).toHaveBeenLastCalledWith(input)
  })
})
