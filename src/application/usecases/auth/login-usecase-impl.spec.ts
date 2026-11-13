import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { LoginUsecaseImpl } from '@/application/usecases/auth/login-usecase-impl'
import { mockUser } from '@/domain/mocks/user.mock'
import { EncoderMock } from '@/infra/mocks/encoder.mock'
import { HasherMock } from '@/infra/mocks/hasher.mock'
import { UserRepositoryMock } from '@/infra/mocks/user-repository.mock'

const makeSut = () => {
  const mockedHasher = new HasherMock()
  const mockedEncoder = new EncoderMock()
  const mockedUserRepository = new UserRepositoryMock()

  const sut = new LoginUsecaseImpl(mockedHasher, mockedEncoder, mockedUserRepository)

  return { sut, mockedHasher, mockedEncoder, mockedUserRepository }
}

const makeInput = () => ({ email: faker.internet.email(), password: faker.internet.password() })

describe('LoginUsecaseImpl', () => {
  it('should throw if user is not found', async () => {
    const { sut, mockedUserRepository } = makeSut()
    vitest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValueOnce(undefined)

    await expect(sut.run(makeInput())).rejects.toThrow('invalid credentials')
  })

  it('should throw if password does not match', async () => {
    const { sut, mockedHasher } = makeSut()
    vitest.spyOn(mockedHasher, 'compare').mockResolvedValueOnce(false)

    await expect(sut.run(makeInput())).rejects.toThrow('invalid credentials')
  })

  it('should compare the given password with the stored hash', async () => {
    const { sut, mockedHasher, mockedUserRepository } = makeSut()
    const user = mockUser()
    vitest.spyOn(mockedUserRepository, 'findByEmail').mockResolvedValueOnce(user)
    const spy = vitest.spyOn(mockedHasher, 'compare')

    const input = makeInput()
    await sut.run(input)

    expect(spy).toHaveBeenLastCalledWith(input.password, user.hashedPassword)
  })

  it('should return the public user and a token on success', async () => {
    const { sut } = makeSut()

    const output = await sut.run(makeInput())

    expect(output.token).toBeTruthy()
    expect(output.user).not.toHaveProperty('hashedPassword')
  })
})
