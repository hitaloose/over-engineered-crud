import { describe, expect, it, vitest } from 'vitest'

import { DomainError } from '@/domain/errors/domain-error'
import { NotFoundError } from '@/domain/errors/not-found-error'
import { UnauthorizedError } from '@/domain/errors/unauthorized-error'
import { ZodValidatorError } from '@/infra/errors/zod-validator-error'
import { Controller } from '@/presentation/contracts/controller'
import { ControllerErrorHandlerDecorator } from '@/presentation/decorators/controller-error-handler-decorator'
import { replyCreated } from '@/presentation/helpers/http'

class ControllerStub implements Controller {
  async handle(): Promise<Controller.Response> {
    return replyCreated({ ok: true })
  }
}

const makeSut = () => {
  const controller = new ControllerStub()
  const sut = new ControllerErrorHandlerDecorator(controller)

  return { sut, controller }
}

describe('ControllerErrorHandlerDecorator', () => {
  it('should forward the request and return the controller response untouched', async () => {
    const { sut, controller } = makeSut()
    const spy = vitest.spyOn(controller, 'handle')
    const request = { body: { a: 1 }, auth: { userId: 'u' } }

    const response = await sut.handle(request)

    expect(spy).toHaveBeenLastCalledWith(request)
    expect(response).toEqual(replyCreated({ ok: true }))
  })

  it.each([
    ['UnauthorizedError', new UnauthorizedError('nope'), Controller.StatusCode.UNAUTHORIZED, { message: 'nope' }],
    ['NotFoundError', new NotFoundError('missing'), Controller.StatusCode.NOT_FOUND, { message: 'missing' }],
    ['DomainError', new DomainError('rule broken'), Controller.StatusCode.UNPROCESSABLE_CONTENT, { message: 'rule broken' }],
    [
      'ZodValidatorError',
      new ZodValidatorError({ title: ['Required'] }),
      Controller.StatusCode.BAD_REQUEST,
      { message: 'Validation error', details: { title: ['Required'] } },
    ],
  ])('should map %s to the right status', async (_name, error, statusCode, body) => {
    const { sut, controller } = makeSut()
    vitest.spyOn(controller, 'handle').mockRejectedValueOnce(error)

    expect(await sut.handle({ body: {} })).toEqual({ statusCode, body })
  })

  it.each([new Error('connection string with password leaked'), 'a thrown string'])(
    'should hide unexpected errors behind a generic 500 (%s)',
    async (error) => {
      const { sut, controller } = makeSut()
      vitest.spyOn(controller, 'handle').mockRejectedValueOnce(error)
      const consoleSpy = vitest.spyOn(console, 'error').mockImplementationOnce(() => {})

      const response = await sut.handle({ body: {} })

      expect(response).toEqual({ statusCode: Controller.StatusCode.SERVER_ERROR, body: { message: 'internal server error' } })
      expect(consoleSpy).toHaveBeenCalledWith(error)
    }
  )
})
