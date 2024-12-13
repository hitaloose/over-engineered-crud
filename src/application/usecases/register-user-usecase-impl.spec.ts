import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { RegisterUserUsecaseImpl } from '@/application/usecases/register-user-usecase-impl'
import { mockUser } from '@/domain/mocks/user.mock'
import { RegisterUserUsecase } from '@/domain/usecases/register-user-usecase'
import { HasherMock } from '@/infra/mocks/hasher.mock'
import { UserRepositoryMock } from '@/infra/mocks/user-repository.mock'

const makeSut = () => {
  const mockedHasher = new HasherMock()
  const mockedUserRepository = new UserRepositoryMock()

  vitest.spyOn(mockedUserRepository, 'findByNameUsernameOrEmail').mockResolvedValue(undefined)

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

  it('should throw if user finder return an user', async () => {
    const { sut, mockedUserRepository } = makeSut()

    vitest.spyOn(mockedUserRepository, 'findByNameUsernameOrEmail').mockResolvedValueOnce(mockUser())

    const promise = sut.run(makeInput())

    await expect(promise).rejects.toThrow('user already register')
  })

  it('should call hasher with correct values', async () => {
    const { sut, mockedHasher } = makeSut()

    const spy = vitest.spyOn(mockedHasher, 'hash')

    const password = faker.internet.password()
    await sut.run(makeInput({ password, passwordConfirmation: password }))

    expect(spy).toHaveBeenLastCalledWith(password)
  })

  it('should call user inserter with correct values', async () => {
    const { sut, mockedUserRepository, mockedHasher } = makeSut()

    const hashedPassword = faker.string.uuid()
    vitest.spyOn(mockedHasher, 'hash').mockResolvedValueOnce(hashedPassword)

    const spy = vitest.spyOn(mockedUserRepository, 'insert')

    const input = makeInput()
    await sut.run(input)

    expect(spy).toHaveBeenLastCalledWith({ ...input, hashedPassword })
  })

  it('should return an created user on success', async () => {
    const { sut } = makeSut()

    const output = await sut.run(makeInput())

    expect(output.user).toBeTruthy()
  })
})
