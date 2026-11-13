import { CreateTaskUsecaseImpl } from '@/application/usecases/tasks/create-task-usecase-impl'
import { DeleteTaskUsecaseImpl } from '@/application/usecases/tasks/delete-task-usecase-impl'
import { GetTaskUsecaseImpl } from '@/application/usecases/tasks/get-task-usecase-impl'
import { ListTasksUsecaseImpl } from '@/application/usecases/tasks/list-tasks-usecase-impl'
import { UpdateTaskUsecaseImpl } from '@/application/usecases/tasks/update-task-usecase-impl'
import { factoryTaskRepository } from '@/main/factories/repositories/factory-task-repository'

export const factoryCreateTaskUsecase = () => new CreateTaskUsecaseImpl(factoryTaskRepository())

export const factoryListTasksUsecase = () => new ListTasksUsecaseImpl(factoryTaskRepository())

export const factoryGetTaskUsecase = () => new GetTaskUsecaseImpl(factoryTaskRepository())

export const factoryUpdateTaskUsecase = () => {
  const taskRepository = factoryTaskRepository()

  return new UpdateTaskUsecaseImpl(taskRepository, taskRepository)
}

export const factoryDeleteTaskUsecase = () => {
  const taskRepository = factoryTaskRepository()

  return new DeleteTaskUsecaseImpl(taskRepository, taskRepository)
}
