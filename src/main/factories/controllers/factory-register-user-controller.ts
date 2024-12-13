import { registerUserSchema } from '@/infra/libs/zod/register-user-schema'
import { factoryRegisterUserUsecase } from '@/main/factories/usecases/factory-register-user-usecase'
import { factoryZodValidator } from '@/main/factories/validators/factory-zod-validator'
import { RegisterUserController } from '@/presentation/controllers/register-user-controller'

export const factoryRegisterUserController = () => {
  return new RegisterUserController(factoryZodValidator(registerUserSchema), factoryRegisterUserUsecase())
}
