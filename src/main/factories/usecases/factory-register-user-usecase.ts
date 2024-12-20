import { RegisterUserUsecaseImpl } from '@/application/usecases/register-user-usecase-impl'
import { factoryBcrypt } from '@/main/factories/cryptography/factory-bcrypt'
import { factoryJwt } from '@/main/factories/cryptography/factory-jwt'
import { factoryUserRepository } from '@/main/factories/repositories/factory-user-repository'

export const factoryRegisterUserUsecase = () => {
  const userRepository = factoryUserRepository()

  return new RegisterUserUsecaseImpl(factoryBcrypt(), factoryJwt(), userRepository, userRepository)
}
