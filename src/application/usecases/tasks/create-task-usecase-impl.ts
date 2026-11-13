import { TaskInserterRepository } from '@/application/contracts/repositories/task-inserter-repository'
import { CreateTaskUsecase } from '@/domain/usecases/tasks/create-task-usecase'

export class CreateTaskUsecaseImpl implements CreateTaskUsecase {
  constructor(private readonly taskInserterRepository: TaskInserterRepository) {}

  async run(input: CreateTaskUsecase.Input): Promise<CreateTaskUsecase.Output> {
    const task = await this.taskInserterRepository.insert({
      userId: input.userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? 'todo',
      dueDate: input.dueDate ?? null,
    })

    return { task }
  }
}
