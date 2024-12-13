import { DomainError } from '@/domain/errors/domain-error'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'
import { Controller } from '@/presentation/contracts/controller'
import { replyBadRequest, replyServerError, replyUnprocessableContent } from '@/presentation/helpers/http'

export class ControllerErrorHandlerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(request: Controller.Request): Promise<Controller.Response> {
    try {
      const response = await this.controller.handle(request)

      return response
    } catch (error) {
      if (error instanceof DomainError) {
        return replyUnprocessableContent({ message: error.message })
      }

      if (error instanceof ZodValidatorError) {
        return replyBadRequest({ message: error.message, details: error.details })
      }

      if (error instanceof Error) {
        return replyServerError({ message: error.message })
      }

      return replyServerError({ message: 'unknown error' })
    }
  }
}
