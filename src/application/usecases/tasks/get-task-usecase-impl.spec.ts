import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { GetTaskUsecaseImpl } from '@/application/usecases/tasks/get-task-usecase-impl'
import { TaskRepositoryMock } from '@/infra/mocks/task-repository.mock'

describe('GetTaskUsecaseImpl', () => {
  it('should look up the task scoped to the user', async () => {
    const mockedTaskRepository = new TaskRepositoryMock()
    const sut = new GetTaskUsecaseImpl(mockedTaskRepository)
    const spy = vitest.spyOn(mockedTaskRepository, 'findById')

    const input = { userId: faker.string.uuid(), taskId: faker.string.uuid() }
    await sut.run(input)

    expect(spy).toHaveBeenLastCalledWith({ id: input.taskId, userId: input.userId })
  })

  it('should throw NotFound when the task does not belong to the user', async () => {
    const mockedTaskRepository = new TaskRepositoryMock()
    const sut = new GetTaskUsecaseImpl(mockedTaskRepository)
    vitest.spyOn(mockedTaskRepository, 'findById').mockResolvedValueOnce(undefined)

    await expect(sut.run({ userId: faker.string.uuid(), taskId: faker.string.uuid() })).rejects.toThrow('task not found')
  })
})
