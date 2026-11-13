import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { UpdateTaskUsecaseMock } from '@/application/mocks/update-task-usecase.mock'
import { UpdateTaskUsecase } from '@/domain/usecases/tasks/update-task-usecase'
import { ZodValidatorMock } from '@/infra/mocks/zod-validator.mock'
import { Controller } from '@/presentation/contracts/controller'
import { UpdateTaskController } from '@/presentation/controllers/tasks/update-task-controller'

const makeSut = () => {
  const mockedValidator = new ZodValidatorMock<Omit<UpdateTaskUsecase.Input, 'userId'>>()
  const mockedUsecase = new UpdateTaskUsecaseMock()
  const sut = new UpdateTaskController(mockedValidator, mockedUsecase)

  return { sut, mockedValidator, mockedUsecase }
}

describe('UpdateTaskController', () => {
  it('should throw Unauthorized when there is no auth', async () => {
    const { sut } = makeSut()

    await expect(sut.handle({ body: {} })).rejects.toThrow('authentication required')
  })

  it('should validate params merged with body, with params taking precedence', async () => {
    const { sut, mockedValidator } = makeSut()
    const spy = vitest.spyOn(mockedValidator, 'run')

    const taskId = faker.string.uuid()
    await sut.handle({ body: { status: 'done', taskId: 'spoofed' }, params: { taskId }, auth: { userId: faker.string.uuid() } })

    expect(spy).toHaveBeenLastCalledWith({ status: 'done', taskId })
  })

  it('should never let the input override the authenticated userId', async () => {
    const { sut, mockedUsecase } = makeSut()
    const spy = vitest.spyOn(mockedUsecase, 'run')

    const userId = faker.string.uuid()
    await sut.handle({ body: { userId: 'someone-else' }, auth: { userId } })

    expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ userId }))
  })

  it('should reply 200 with the usecase output', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ body: {}, auth: { userId: faker.string.uuid() } })

    expect(response.statusCode).toBe(Controller.StatusCode.OK)
    expect(response.body?.task).toBeTruthy()
  })
})
