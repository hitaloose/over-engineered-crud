import { loginSchema } from '@/infra/libs/zod/login-schema'
import { factoryGetMeUsecase, factoryLoginUsecase } from '@/main/factories/usecases/factory-auth-usecases'
import { factoryZodValidator } from '@/main/factories/validators/factory-zod-validator'
import { GetMeController } from '@/presentation/controllers/auth/get-me-controller'
import { LoginController } from '@/presentation/controllers/auth/login-controller'

export const factoryLoginController = () => new LoginController(factoryZodValidator(loginSchema), factoryLoginUsecase())

export const factoryGetMeController = () => new GetMeController(factoryGetMeUsecase())
