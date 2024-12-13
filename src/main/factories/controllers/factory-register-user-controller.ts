import { HasherMock } from '@/infra/mocks/hasher.mock'
import { UserRepositoryMock } from '@/infra/mocks/user-repository.mock'
import { RegisterUserUsecaseImpl } from '@/application/usecases/register-user-usecase-impl'
import { registerUserSchema } from '@/infra/libs/zod/register-user-schema'
import { factoryZodValidator } from '@/main/factories/validators/factory-zod-validator'
import { RegisterUserController } from '@/presentation/controllers/register-user-controller'

export const factoryRegisterUserController = () => {
  return new RegisterUserController(
    factoryZodValidator(registerUserSchema),
    new RegisterUserUsecaseImpl(new HasherMock(), new UserRepositoryMock(), new UserRepositoryMock())
  )
}
