export interface Controller {
  handle(request: Controller.Request): Promise<Controller.Response>
}

export namespace Controller {
  export type Request = {
    body: Record<string, unknown>
  }

  export type Response = {
    statusCode: StatusCode
    body?: Record<string, unknown>
  }

  export enum StatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNPROCESSABLE_CONTENT = 422,
    SERVER_ERROR = 500,
  }
}
