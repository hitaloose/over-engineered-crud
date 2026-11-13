import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { CreateTaskUsecaseImpl } from '@/application/usecases/tasks/create-task-usecase-impl'
import { TaskRepositoryMock } from '@/infra/mocks/task-repository.mock'

const makeSut = () => {
  const mockedTaskRepository = new TaskRepositoryMock()
  const sut = new CreateTaskUsecaseImpl(mockedTaskRepository)

  return { sut, mockedTaskRepository }
}

describe('CreateTaskUsecaseImpl', () => {
  it('should apply defaults for optional fields', async () => {
    const { sut, mockedTaskRepository } = makeSut()
    const spy = vitest.spyOn(mockedTaskRepository, 'insert')

    const userId = faker.string.uuid()
    await sut.run({ userId, title: 'write tests' })

    expect(spy).toHaveBeenLastCalledWith({ userId, title: 'write tests', description: null, status: 'todo', dueDate: null })
  })

  it('should return the created task', async () => {
    const { sut } = makeSut()

    const { task } = await sut.run({ userId: faker.string.uuid(), title: 'write tests' })

    expect(task.id).toBeTruthy()
  })
})
