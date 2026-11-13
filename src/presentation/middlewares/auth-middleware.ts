import { DomainError } from '@/domain/errors/domain-error'
import { AuthenticateUsecase } from '@/domain/usecases/auth/authenticate-usecase'
import { Middleware } from '@/presentation/contracts/middleware'
import { replyUnauthorized } from '@/presentation/helpers/http'

export class AuthMiddleware implements Middleware {
  constructor(private readonly authenticateUsecase: AuthenticateUsecase) {}

  async handle(request: Middleware.Request): Promise<Middleware.Response> {
    const [scheme, token] = (request.authorization || '').split(' ')

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return { success: false, response: replyUnauthorized({ message: 'missing bearer token' }) }
    }

    try {
      const auth = await this.authenticateUsecase.run({ token })

      return { success: true, auth }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, response: replyUnauthorized({ message: error.message }) }
      }

      throw error
    }
  }
}
