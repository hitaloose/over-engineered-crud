import { TaskListerRepository } from '@/application/contracts/repositories/task-lister-repository'
import { ListTasksUsecase } from '@/domain/usecases/tasks/list-tasks-usecase'

export class ListTasksUsecaseImpl implements ListTasksUsecase {
  constructor(private readonly taskListerRepository: TaskListerRepository) {}

  async run(input: ListTasksUsecase.Input): Promise<ListTasksUsecase.Output> {
    const { tasks, total } = await this.taskListerRepository.list({
      userId: input.userId,
      status: input.status,
      offset: (input.page - 1) * input.perPage,
      limit: input.perPage,
    })

    return { tasks, total, page: input.page, perPage: input.perPage }
  }
}
