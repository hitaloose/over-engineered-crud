import { Controller } from '@/presentation/contracts/controller'

export const replyCreated = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.CREATED,
  body,
})

export const replyOk = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.OK,
  body,
})
