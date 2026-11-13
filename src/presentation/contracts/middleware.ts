import { Auth } from '@/domain/contracts/auth'
import { Controller } from '@/presentation/contracts/controller'

export interface Middleware {
  handle(request: Middleware.Request): Promise<Middleware.Response>
}

export namespace Middleware {
  export type Request = {
    authorization?: string
  }

  export type Response = { success: true; auth: Auth } | { success: false; response: Controller.Response }
}
