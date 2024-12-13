import { Controller } from '@/presentation/contracts/controller'

export const replyCreated = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.CREATED,
  body,
})

export const replyOk = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.OK,
  body,
})

export const replyBadRequest = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.BAD_REQUEST,
  body,
})

export const replyUnprocessableContent = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.UNPROCESSABLE_CONTENT,
  body,
})

export const replyServerError = (body?: Record<string, unknown>): Controller.Response => ({
  statusCode: Controller.StatusCode.SERVER_ERROR,
  body,
})
