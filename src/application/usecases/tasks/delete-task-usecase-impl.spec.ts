import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { DeleteTaskUsecaseImpl } from '@/application/usecases/tasks/delete-task-usecase-impl'
import { TaskRepositoryMock } from '@/infra/mocks/task-repository.mock'

const makeSut = () => {
  const mockedTaskRepository = new TaskRepositoryMock()
  const sut = new DeleteTaskUsecaseImpl(mockedTaskRepository, mockedTaskRepository)

  return { sut, mockedTaskRepository }
}

describe('DeleteTaskUsecaseImpl', () => {
  it('should throw NotFound and not remove when the task is not the user one', async () => {
    const { sut, mockedTaskRepository } = makeSut()
    vitest.spyOn(mockedTaskRepository, 'findById').mockResolvedValueOnce(undefined)
    const removeSpy = vitest.spyOn(mockedTaskRepository, 'remove')

    await expect(sut.run({ userId: faker.string.uuid(), taskId: faker.string.uuid() })).rejects.toThrow('task not found')
    expect(removeSpy).not.toHaveBeenCalled()
  })

  it('should remove the task', async () => {
    const { sut, mockedTaskRepository } = makeSut()
    const spy = vitest.spyOn(mockedTaskRepository, 'remove')

    const taskId = faker.string.uuid()
    await sut.run({ userId: faker.string.uuid(), taskId })

    expect(spy).toHaveBeenLastCalledWith(taskId)
  })
})
