import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { GetMeUsecaseImpl } from '@/application/usecases/auth/get-me-usecase-impl'
import { UserRepositoryMock } from '@/infra/mocks/user-repository.mock'

const makeSut = () => {
  const mockedUserRepository = new UserRepositoryMock()
  const sut = new GetMeUsecaseImpl(mockedUserRepository)

  return { sut, mockedUserRepository }
}

describe('GetMeUsecaseImpl', () => {
  it('should throw NotFound if user no longer exists', async () => {
    const { sut, mockedUserRepository } = makeSut()
    vitest.spyOn(mockedUserRepository, 'findById').mockResolvedValueOnce(undefined)

    await expect(sut.run({ userId: faker.string.uuid() })).rejects.toThrow('user not found')
  })

  it('should not expose the password hash', async () => {
    const { sut } = makeSut()

    const { user } = await sut.run({ userId: faker.string.uuid() })

    expect(user).not.toHaveProperty('hashedPassword')
  })
})
