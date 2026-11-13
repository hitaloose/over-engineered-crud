import { Router } from 'express'

import { expressControllerAdapter } from '@/main/adapters/express-controller-adapter'
import { expressMiddlewareAdapter } from '@/main/adapters/express-middleware-adapter'
import { factoryGetMeController, factoryLoginController } from '@/main/factories/controllers/factory-auth-controllers'
import { factoryRegisterUserController } from '@/main/factories/controllers/factory-register-user-controller'
import {
  factoryCreateTaskController,
  factoryDeleteTaskController,
  factoryGetTaskController,
  factoryListTasksController,
  factoryUpdateTaskController,
} from '@/main/factories/controllers/factory-task-controllers'
import { factoryAuthMiddleware } from '@/main/factories/middlewares/factory-auth-middleware'

const authenticated = expressMiddlewareAdapter(factoryAuthMiddleware())

export const routes = Router()

routes.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

routes.post('/auth/register', expressControllerAdapter(factoryRegisterUserController()))
routes.post('/auth/login', expressControllerAdapter(factoryLoginController()))
routes.get('/auth/me', authenticated, expressControllerAdapter(factoryGetMeController()))

routes.post('/tasks', authenticated, expressControllerAdapter(factoryCreateTaskController()))
routes.get('/tasks', authenticated, expressControllerAdapter(factoryListTasksController()))
routes.get('/tasks/:taskId', authenticated, expressControllerAdapter(factoryGetTaskController()))
routes.patch('/tasks/:taskId', authenticated, expressControllerAdapter(factoryUpdateTaskController()))
routes.delete('/tasks/:taskId', authenticated, expressControllerAdapter(factoryDeleteTaskController()))
