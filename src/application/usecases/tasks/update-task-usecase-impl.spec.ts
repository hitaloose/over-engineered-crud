import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { UpdateTaskUsecaseImpl } from '@/application/usecases/tasks/update-task-usecase-impl'
import { TaskRepositoryMock } from '@/infra/mocks/task-repository.mock'

const makeSut = () => {
  const mockedTaskRepository = new TaskRepositoryMock()
  const sut = new UpdateTaskUsecaseImpl(mockedTaskRepository, mockedTaskRepository)

  return { sut, mockedTaskRepository }
}

describe('UpdateTaskUsecaseImpl', () => {
  it('should throw NotFound and not update when the task is not the user one', async () => {
    const { sut, mockedTaskRepository } = makeSut()
    vitest.spyOn(mockedTaskRepository, 'findById').mockResolvedValueOnce(undefined)
    const updateSpy = vitest.spyOn(mockedTaskRepository, 'update')

    await expect(sut.run({ userId: faker.string.uuid(), taskId: faker.string.uuid(), status: 'done' })).rejects.toThrow('task not found')
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('should update only the given fields', async () => {
    const { sut, mockedTaskRepository } = makeSut()
    const spy = vitest.spyOn(mockedTaskRepository, 'update')

    const taskId = faker.string.uuid()
    await sut.run({ userId: faker.string.uuid(), taskId, status: 'done' })

    expect(spy).toHaveBeenLastCalledWith(taskId, { status: 'done' })
  })
})
