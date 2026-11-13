import { Controller } from '@/presentation/contracts/controller'

const reply =
  (statusCode: Controller.StatusCode) =>
  (body?: Record<string, unknown>): Controller.Response => ({ statusCode, body })

export const replyOk = reply(Controller.StatusCode.OK)
export const replyCreated = reply(Controller.StatusCode.CREATED)
export const replyNoContent = (): Controller.Response => ({ statusCode: Controller.StatusCode.NO_CONTENT })
export const replyBadRequest = reply(Controller.StatusCode.BAD_REQUEST)
export const replyUnauthorized = reply(Controller.StatusCode.UNAUTHORIZED)
export const replyNotFound = reply(Controller.StatusCode.NOT_FOUND)
export const replyUnprocessableContent = reply(Controller.StatusCode.UNPROCESSABLE_CONTENT)
export const replyServerError = reply(Controller.StatusCode.SERVER_ERROR)
