import { mockTask } from '@/domain/mocks/task.mock'
import { UpdateTaskUsecase } from '@/domain/usecases/tasks/update-task-usecase'

export class UpdateTaskUsecaseMock implements UpdateTaskUsecase {
  async run(): Promise<UpdateTaskUsecase.Output> {
    return { task: mockTask() }
  }
}
