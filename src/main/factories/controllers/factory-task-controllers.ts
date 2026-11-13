import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from '@/infra/libs/zod/task-schemas'
import {
  factoryCreateTaskUsecase,
  factoryDeleteTaskUsecase,
  factoryGetTaskUsecase,
  factoryListTasksUsecase,
  factoryUpdateTaskUsecase,
} from '@/main/factories/usecases/factory-task-usecases'
import { factoryZodValidator } from '@/main/factories/validators/factory-zod-validator'
import { CreateTaskController } from '@/presentation/controllers/tasks/create-task-controller'
import { DeleteTaskController } from '@/presentation/controllers/tasks/delete-task-controller'
import { GetTaskController } from '@/presentation/controllers/tasks/get-task-controller'
import { ListTasksController } from '@/presentation/controllers/tasks/list-tasks-controller'
import { UpdateTaskController } from '@/presentation/controllers/tasks/update-task-controller'

export const factoryCreateTaskController = () => new CreateTaskController(factoryZodValidator(createTaskSchema), factoryCreateTaskUsecase())

export const factoryListTasksController = () => new ListTasksController(factoryZodValidator(listTasksSchema), factoryListTasksUsecase())

export const factoryGetTaskController = () => new GetTaskController(factoryZodValidator(taskIdSchema), factoryGetTaskUsecase())

export const factoryUpdateTaskController = () => new UpdateTaskController(factoryZodValidator(updateTaskSchema), factoryUpdateTaskUsecase())

export const factoryDeleteTaskController = () => new DeleteTaskController(factoryZodValidator(taskIdSchema), factoryDeleteTaskUsecase())
