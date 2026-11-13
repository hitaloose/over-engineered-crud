import { TaskFinderByIdRepository } from '@/application/contracts/repositories/task-finder-by-id-repository'
import { TaskRemoverRepository } from '@/application/contracts/repositories/task-remover-repository'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { DeleteTaskUsecase } from '@/domain/usecases/tasks/delete-task-usecase'

export class DeleteTaskUsecaseImpl implements DeleteTaskUsecase {
  constructor(
    private readonly taskFinderByIdRepository: TaskFinderByIdRepository,
    private readonly taskRemoverRepository: TaskRemoverRepository
  ) {}

  async run(input: DeleteTaskUsecase.Input): Promise<DeleteTaskUsecase.Output> {
    const existingTask = await this.taskFinderByIdRepository.findById({ id: input.taskId, userId: input.userId })

    if (!existingTask) {
      throw new NotFoundError('task not found')
    }

    await this.taskRemoverRepository.remove(input.taskId)
  }
}
