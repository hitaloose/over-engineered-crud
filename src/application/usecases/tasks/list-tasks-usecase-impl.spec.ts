import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { ListTasksUsecaseImpl } from '@/application/usecases/tasks/list-tasks-usecase-impl'
import { TaskRepositoryMock } from '@/infra/mocks/task-repository.mock'

describe('ListTasksUsecaseImpl', () => {
  it('should translate page/perPage into offset/limit', async () => {
    const mockedTaskRepository = new TaskRepositoryMock()
    const sut = new ListTasksUsecaseImpl(mockedTaskRepository)
    const spy = vitest.spyOn(mockedTaskRepository, 'list')

    const userId = faker.string.uuid()
    const output = await sut.run({ userId, status: 'done', page: 3, perPage: 10 })

    expect(spy).toHaveBeenLastCalledWith({ userId, status: 'done', offset: 20, limit: 10 })
    expect(output).toMatchObject({ total: 2, page: 3, perPage: 10 })
  })
})
