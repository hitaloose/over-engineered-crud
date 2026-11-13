import { Auth } from '@/domain/contracts/auth'

export interface Controller {
  handle(request: Controller.Request): Promise<Controller.Response>
}

export namespace Controller {
  export type Request = {
    body: Record<string, unknown>
    params?: Record<string, unknown>
    query?: Record<string, unknown>
    auth?: Auth
  }

  export type Response = {
    statusCode: StatusCode
    body?: Record<string, unknown>
  }

  export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    UNPROCESSABLE_CONTENT = 422,
    SERVER_ERROR = 500,
  }
}
