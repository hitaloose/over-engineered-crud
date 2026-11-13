import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { AuthenticateUsecaseImpl } from '@/application/usecases/auth/authenticate-usecase-impl'
import { DecoderMock } from '@/infra/mocks/decoder.mock'

const makeSut = () => {
  const mockedDecoder = new DecoderMock()
  const sut = new AuthenticateUsecaseImpl(mockedDecoder)

  return { sut, mockedDecoder }
}

describe('AuthenticateUsecaseImpl', () => {
  it('should throw if token cannot be decoded', async () => {
    const { sut, mockedDecoder } = makeSut()
    vitest.spyOn(mockedDecoder, 'decode').mockResolvedValueOnce(undefined)

    await expect(sut.run({ token: 'any' })).rejects.toThrow('invalid token')
  })

  it('should throw if payload has no subject', async () => {
    const { sut, mockedDecoder } = makeSut()
    vitest.spyOn(mockedDecoder, 'decode').mockResolvedValueOnce({ foo: 'bar' })

    await expect(sut.run({ token: 'any' })).rejects.toThrow('invalid token')
  })

  it('should return the userId from the token subject', async () => {
    const { sut, mockedDecoder } = makeSut()
    const sub = faker.string.uuid()
    vitest.spyOn(mockedDecoder, 'decode').mockResolvedValueOnce({ sub })

    expect(await sut.run({ token: 'any' })).toEqual({ userId: sub })
  })
})
