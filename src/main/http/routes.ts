import { Router } from 'express'

import { expressControllerAdapter } from '@/main/adapters/express-controller-adapter'
import { factoryRegisterUserController } from '@/main/factories/controllers/factory-register-user-controller'

export const routes = Router()

routes.post('/auth/register', expressControllerAdapter(factoryRegisterUserController()))
