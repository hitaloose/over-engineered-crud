import { TaskFinderByIdRepository } from '@/application/contracts/repositories/task-finder-by-id-repository'
import { TaskInserterRepository } from '@/application/contracts/repositories/task-inserter-repository'
import { TaskListerRepository } from '@/application/contracts/repositories/task-lister-repository'
import { TaskRemoverRepository } from '@/application/contracts/repositories/task-remover-repository'
import { TaskUpdaterRepository } from '@/application/contracts/repositories/task-updater-repository'
import { Task } from '@/domain/entities/task'
import { mockTask } from '@/domain/mocks/task.mock'

export class TaskRepositoryMock
  implements TaskInserterRepository, TaskFinderByIdRepository, TaskListerRepository, TaskUpdaterRepository, TaskRemoverRepository
{
  async insert(): Promise<Task> {
    return mockTask()
  }

  async findById(): Promise<Task | undefined> {
    return mockTask()
  }

  async list(): Promise<TaskListerRepository.Output> {
    return { tasks: [mockTask(), mockTask()], total: 2 }
  }

  async update(): Promise<Task> {
    return mockTask()
  }

  async remove(): Promise<void> {}
}
