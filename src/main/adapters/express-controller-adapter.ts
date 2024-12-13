import { Request, Response } from 'express'

import { Controller } from '@/presentation/contracts/controller'
import { ControllerErrorHandlerDecorator } from '@/presentation/decorators/controller-error-handler-decorator'

export const expressControllerAdapter = (controller: Controller) => {
  const decoratedController = new ControllerErrorHandlerDecorator(controller)

  return async (request: Request, response: Response) => {
    const { statusCode, body } = await decoratedController.handle({ body: request.body || {} })

    response.status(statusCode).json(body)
  }
}
