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
  }
}
