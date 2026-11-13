import { NextFunction, Request, Response } from 'express'

import { Middleware } from '@/presentation/contracts/middleware'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await middleware.handle({ authorization: request.headers.authorization })

      if (!result.success) {
        response.status(result.response.statusCode).json(result.response.body)
        return
      }

      response.locals.auth = result.auth
      next()
    } catch (error) {
      next(error)
    }
  }
}
