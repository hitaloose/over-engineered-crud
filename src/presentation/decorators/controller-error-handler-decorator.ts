import { DomainError } from '@/domain/errors/domain-error'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'
import { Controller } from '@/presentation/contracts/controller'
import { replyBadRequest, replyNotFound, replyServerError, replyUnauthorized, replyUnprocessableContent } from '@/presentation/helpers/http'

export class ControllerErrorHandlerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    try {
      return await this.controller.handle(request)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return replyUnauthorized({ message: error.message })
      }

      if (error instanceof NotFoundError) {
        return replyNotFound({ message: error.message })
      }

      if (error instanceof DomainError) {
        return replyUnprocessableContent({ message: error.message })
      }

      if (error instanceof ZodValidatorError) {
        return replyBadRequest({ message: error.message, details: error.details })
      }

      console.error(error)

      return replyServerError({ message: 'internal server error' })
    }
  }
}
