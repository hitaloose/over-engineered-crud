import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { Usecase } from '@/domain/contracts/usecase'
import { mockTask } from '@/domain/mocks/task.mock'
import { ZodValidatorMock } from '@/infra/mocks/zod-validator.mock'
import { Controller } from '@/presentation/contracts/controller'
import { CreateTaskController } from '@/presentation/controllers/tasks/create-task-controller'
import { DeleteTaskController } from '@/presentation/controllers/tasks/delete-task-controller'
import { GetTaskController } from '@/presentation/controllers/tasks/get-task-controller'
import { ListTasksController } from '@/presentation/controllers/tasks/list-tasks-controller'

/** Generic stub: the task controllers only care that the usecase is called and what it returns. */
class UsecaseStub implements Usecase<unknown, unknown> {
  constructor(private readonly output: unknown) {}

  async run(): Promise<unknown> {
    return this.output
  }
}

type AnyController = new (validator: ZodValidatorMock<never>, usecase: never) => Controller

const cases: { name: string; Sut: AnyController; output: unknown; statusCode: Controller.StatusCode }[] = [
  {
    name: 'CreateTaskController',
    Sut: CreateTaskController as unknown as AnyController,
    output: { task: mockTask() },
    statusCode: Controller.StatusCode.CREATED,
  },
  {
    name: 'ListTasksController',
    Sut: ListTasksController as unknown as AnyController,
    output: { tasks: [mockTask()], total: 1, page: 1, perPage: 20 },
    statusCode: Controller.StatusCode.OK,
  },
  { name: 'GetTaskController', Sut: GetTaskController as unknown as AnyController, output: { task: mockTask() }, statusCode: Controller.StatusCode.OK },
  { name: 'DeleteTaskController', Sut: DeleteTaskController as unknown as AnyController, output: undefined, statusCode: Controller.StatusCode.NO_CONTENT },
]

describe.each(cases)('$name', ({ Sut, output, statusCode }) => {
  const makeSut = () => {
    const validator = new ZodValidatorMock<never>()
    const usecase = new UsecaseStub(output)
    const sut = new Sut(validator, usecase as never)

    return { sut, validator, usecase }
  }

  it('should require authentication before validating', async () => {
    const { sut, validator } = makeSut()
    const spy = vitest.spyOn(validator, 'run')

    await expect(sut.handle({ body: {} })).rejects.toThrow('authentication required')
    expect(spy).not.toHaveBeenCalled()
  })

  it('should run the usecase with validated input and the authenticated userId', async () => {
    const { sut, usecase } = makeSut()
    const spy = vitest.spyOn(usecase, 'run')
    const userId = faker.string.uuid()

    await sut.handle({ body: { title: 't', userId: 'attacker' }, query: { page: '1' }, auth: { userId } })

    expect(spy).toHaveBeenLastCalledWith({ title: 't', page: '1', userId })
  })

  it(`should reply ${statusCode}`, async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ body: {}, auth: { userId: faker.string.uuid() } })

    expect(response.statusCode).toBe(statusCode)
    expect(response.body).toEqual(output)
  })
})
