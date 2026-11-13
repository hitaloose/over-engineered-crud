import { TaskFinderByIdRepository } from '@/application/contracts/repositories/task-finder-by-id-repository'
import { TaskUpdaterRepository } from '@/application/contracts/repositories/task-updater-repository'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { UpdateTaskUsecase } from '@/domain/usecases/tasks/update-task-usecase'

export class UpdateTaskUsecaseImpl implements UpdateTaskUsecase {
  constructor(
    private readonly taskFinderByIdRepository: TaskFinderByIdRepository,
    private readonly taskUpdaterRepository: TaskUpdaterRepository
  ) {}

  async run({ userId, taskId, ...values }: UpdateTaskUsecase.Input): Promise<UpdateTaskUsecase.Output> {
    const existingTask = await this.taskFinderByIdRepository.findById({ id: taskId, userId })

    if (!existingTask) {
      throw new NotFoundError('task not found')
    }

    const task = await this.taskUpdaterRepository.update(taskId, values)

    return { task }
  }
}
