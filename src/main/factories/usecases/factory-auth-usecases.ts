import { AuthenticateUsecaseImpl } from '@/application/usecases/auth/authenticate-usecase-impl'
import { GetMeUsecaseImpl } from '@/application/usecases/auth/get-me-usecase-impl'
import { LoginUsecaseImpl } from '@/application/usecases/auth/login-usecase-impl'
import { factoryBcrypt } from '@/main/factories/cryptography/factory-bcrypt'
import { factoryJwt } from '@/main/factories/cryptography/factory-jwt'
import { factoryUserRepository } from '@/main/factories/repositories/factory-user-repository'

export const factoryLoginUsecase = () => new LoginUsecaseImpl(factoryBcrypt(), factoryJwt(), factoryUserRepository())

export const factoryAuthenticateUsecase = () => new AuthenticateUsecaseImpl(factoryJwt())

export const factoryGetMeUsecase = () => new GetMeUsecaseImpl(factoryUserRepository())
