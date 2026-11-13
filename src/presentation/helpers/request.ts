import { Auth } from '@/domain/contracts/auth'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { Controller } from '@/presentation/contracts/controller'

/** Merges every input source so a controller doesn't care whether a value came from the path, query string or body. */
export const requestInput = (request: Controller.Request): Record<string, unknown> => ({
  ...request.query,
  ...request.body,
  ...request.params,
})

export const requireAuth = (request: Controller.Request): Auth => {
  if (!request.auth) {
    throw new UnauthorizedError('authentication required')
  }

  return request.auth
}
