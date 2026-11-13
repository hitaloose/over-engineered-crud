import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { toPublicUser } from '@/domain/entities/user'
import { mockUser } from '@/domain/mocks/user.mock'
import { GetMeUsecase } from '@/domain/usecases/auth/get-me-usecase'
import { Controller } from '@/presentation/contracts/controller'
import { GetMeController } from '@/presentation/controllers/auth/get-me-controller'

class GetMeUsecaseStub implements GetMeUsecase {
  async run(): Promise<GetMeUsecase.Output> {
    return { user: toPublicUser(mockUser()) }
  }
}

describe('GetMeController', () => {
  it('should require authentication', async () => {
    const sut = new GetMeController(new GetMeUsecaseStub())

    await expect(sut.handle({ body: {} })).rejects.toThrow('authentication required')
  })

  it('should run the usecase with the authenticated user and reply 200', async () => {
    const usecase = new GetMeUsecaseStub()
    const spy = vitest.spyOn(usecase, 'run')
    const sut = new GetMeController(usecase)
    const userId = faker.string.uuid()

    const response = await sut.handle({ body: { userId: 'ignored' }, auth: { userId } })

    expect(spy).toHaveBeenLastCalledWith({ userId })
    expect(response.statusCode).toBe(Controller.StatusCode.OK)
  })
})
