import { faker } from '@faker-js/faker'
import { describe, expect, it, vitest } from 'vitest'

import { NotFoundError } from '@/domain/errors/not-found-error'
import { McpRequestExtra, mcpToolAdapter } from '@/main/adapters/mcp-tool-adapter'
import { Controller } from '@/presentation/contracts/controller'
import { replyNoContent, replyOk } from '@/presentation/helpers/http'

class ControllerStub implements Controller {
  async handle(): Promise<Controller.Response> {
    return replyOk({ task: { id: '1', dueDate: new Date('2030-01-01T00:00:00.000Z') } })
  }
}

const extra = {} as McpRequestExtra

describe('mcpToolAdapter', () => {
  it('should pass args as body and the resolved auth to the controller', async () => {
    const controller = new ControllerStub()
    const spy = vitest.spyOn(controller, 'handle')
    const userId = faker.string.uuid()

    await mcpToolAdapter(controller, () => ({ userId }))({ title: 'x' }, extra)

    expect(spy).toHaveBeenLastCalledWith({ body: { title: 'x' }, auth: { userId } })
  })

  it('should apply a custom args mapper', async () => {
    const controller = new ControllerStub()
    const spy = vitest.spyOn(controller, 'handle')

    await mcpToolAdapter(
      controller,
      () => undefined,
      (args: { id: string }) => ({ body: { taskId: args.id, status: 'done' } })
    )({ id: '1' }, extra)

    expect(spy).toHaveBeenLastCalledWith({ body: { taskId: '1', status: 'done' }, auth: undefined })
  })

  it('should return JSON-safe structured content', async () => {
    const result = await mcpToolAdapter(new ControllerStub(), () => undefined)({}, extra)

    expect(result.isError).toBe(false)
    expect(result.structuredContent).toEqual({ task: { id: '1', dueDate: '2030-01-01T00:00:00.000Z' } })
    expect(result.content[0]).toMatchObject({ type: 'text' })
  })

  it('should report a successful empty response', async () => {
    const controller = new ControllerStub()
    vitest.spyOn(controller, 'handle').mockResolvedValueOnce(replyNoContent())

    const result = await mcpToolAdapter(controller, () => undefined)({}, extra)

    expect(result).toMatchObject({ isError: false, structuredContent: { success: true } })
  })

  it('should flag controller errors as tool errors', async () => {
    const controller = new ControllerStub()
    vitest.spyOn(controller, 'handle').mockRejectedValueOnce(new NotFoundError('task not found'))

    const result = await mcpToolAdapter(controller, () => undefined)({}, extra)

    expect(result).toMatchObject({ isError: true, structuredContent: { message: 'task not found' } })
  })
})
