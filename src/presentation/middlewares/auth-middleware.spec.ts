import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { AuthenticateUsecaseMock } from '@/application/mocks/authenticate-usecase.mock'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { Controller } from '@/presentation/contracts/controller'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

const makeSut = () => {
  const mockedAuthenticateUsecase = new AuthenticateUsecaseMock()
  const sut = new AuthMiddleware(mockedAuthenticateUsecase)

  return { sut, mockedAuthenticateUsecase }
}

describe('AuthMiddleware', () => {
  it.each([undefined, '', 'Basic abc', 'Bearer'])('should reply 401 for authorization header %j', async (authorization) => {
    const { sut } = makeSut()

    const result = await sut.handle({ authorization })

    expect(result).toMatchObject({ success: false, response: { statusCode: Controller.StatusCode.UNAUTHORIZED } })
  })

  it('should reply 401 when the token is rejected', async () => {
    const { sut, mockedAuthenticateUsecase } = makeSut()
    vitest.spyOn(mockedAuthenticateUsecase, 'run').mockRejectedValueOnce(new UnauthorizedError('invalid token'))

    const result = await sut.handle({ authorization: 'Bearer bad' })

    expect(result).toEqual({ success: false, response: { statusCode: Controller.StatusCode.UNAUTHORIZED, body: { message: 'invalid token' } } })
  })

  it('should return auth on success', async () => {
    const { sut, mockedAuthenticateUsecase } = makeSut()
    const userId = faker.string.uuid()
    const spy = vitest.spyOn(mockedAuthenticateUsecase, 'run').mockResolvedValueOnce({ userId })

    const result = await sut.handle({ authorization: 'Bearer good-token' })

    expect(spy).toHaveBeenLastCalledWith({ token: 'good-token' })
    expect(result).toEqual({ success: true, auth: { userId } })
  })

  it('should accept a case-insensitive scheme', async () => {
    const { sut } = makeSut()

    expect(await sut.handle({ authorization: 'bearer token' })).toMatchObject({ success: true })
  })

  it('should rethrow unexpected errors instead of hiding them as 401', async () => {
    const { sut, mockedAuthenticateUsecase } = makeSut()
    vitest.spyOn(mockedAuthenticateUsecase, 'run').mockRejectedValueOnce(new Error('db down'))

    await expect(sut.handle({ authorization: 'Bearer token' })).rejects.toThrow('db down')
  })
})
