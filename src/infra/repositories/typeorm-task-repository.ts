import { TaskFinderByIdRepository } from '@/application/contracts/repositories/task-finder-by-id-repository'
import { TaskInserterRepository } from '@/application/contracts/repositories/task-inserter-repository'
import { TaskListerRepository } from '@/application/contracts/repositories/task-lister-repository'
import { TaskRemoverRepository } from '@/application/contracts/repositories/task-remover-repository'
import { TaskUpdaterRepository } from '@/application/contracts/repositories/task-updater-repository'
import { BaseEntity } from '@/domain/entities/base-entity'
import { Task } from '@/domain/entities/task'
import { dataSource } from '@/infra/libs/typeorm/config'
import { TaskTypeorm } from '@/infra/libs/typeorm/entities/task-typeorm'

export class TypeormTaskRepository
  implements TaskInserterRepository, TaskFinderByIdRepository, TaskListerRepository, TaskUpdaterRepository, TaskRemoverRepository
{
  private get repository() {
    return dataSource.getRepository(TaskTypeorm)
  }

  async insert(values: Omit<Task, keyof BaseEntity>): Promise<Task> {
    return this.repository.save(this.repository.create(values))
  }

  async findById(input: TaskFinderByIdRepository.Input): Promise<Task | undefined> {
    const task = await this.repository.findOneBy({ id: input.id, userId: input.userId })

    return task || undefined
  }

  async list(input: TaskListerRepository.Input): Promise<TaskListerRepository.Output> {
    const [tasks, total] = await this.repository.findAndCount({
      where: { userId: input.userId, ...(input.status && { status: input.status }) },
      order: { createdAt: 'DESC' },
      skip: input.offset,
      take: input.limit,
    })

    return { tasks, total }
  }

  async update(id: string, values: TaskUpdaterRepository.Values): Promise<Task> {
    const task = await this.repository.findOneByOrFail({ id })

    const definedValues = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined))

    return this.repository.save(this.repository.merge(task, definedValues))
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete({ id })
  }
}
