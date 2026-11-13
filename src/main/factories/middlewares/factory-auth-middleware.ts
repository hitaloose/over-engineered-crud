import { factoryAuthenticateUsecase } from '@/main/factories/usecases/factory-auth-usecases'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

export const factoryAuthMiddleware = () => new AuthMiddleware(factoryAuthenticateUsecase())
