import { TaskFinderByIdRepository } from '@/application/contracts/repositories/task-finder-by-id-repository'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { GetTaskUsecase } from '@/domain/usecases/tasks/get-task-usecase'

export class GetTaskUsecaseImpl implements GetTaskUsecase {
  constructor(private readonly taskFinderByIdRepository: TaskFinderByIdRepository) {}

  async run(input: GetTaskUsecase.Input): Promise<GetTaskUsecase.Output> {
    const task = await this.taskFinderByIdRepository.findById({ id: input.taskId, userId: input.userId })

    if (!task) {
      throw new NotFoundError('task not found')
    }

    return { task }
  }
}
