import 'reflect-metadata'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { dataSource } from '@/infra/libs/typeorm/config'
import { factoryRegisterUserUsecase } from '@/main/factories/usecases/factory-register-user-usecase'
import { createMcpServer } from '@/main/mcp/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- loose access to tool payloads keeps assertions readable
type ToolResult = { isError?: boolean; structuredContent?: Record<string, any> }

describe('MCP server (integration)', () => {
  const client = new Client({ name: 'test-client', version: '1.0.0' })

  beforeAll(async () => {
    await dataSource.initialize()

    const { user } = await factoryRegisterUserUsecase().run({
      name: 'Grace Hopper',
      username: 'grace',
      email: 'grace@example.com',
      password: 'secret123',
      passwordConfirmation: 'secret123',
    })

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await createMcpServer({ resolveAuth: () => ({ userId: user.id }) }).connect(serverTransport)
    await client.connect(clientTransport)
  })

  afterAll(async () => {
    await client.close()
    await dataSource.destroy()
  })

  const callTool = (name: string, args: Record<string, unknown> = {}) => client.callTool({ name, arguments: args }) as Promise<ToolResult>

  it('lists the tool catalog with JSON schemas', async () => {
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name)).toEqual(['whoami', 'list_tasks', 'get_task', 'create_task', 'update_task', 'complete_task', 'delete_task'])
    expect(tools.find((tool) => tool.name === 'create_task')?.inputSchema.required).toEqual(['title'])
  })

  it('identifies the authenticated user', async () => {
    const result = await callTool('whoami')

    expect(result.structuredContent?.user.username).toBe('grace')
  })

  it('creates, completes, lists and deletes tasks', async () => {
    const created = await callTool('create_task', { title: 'Write the README' })
    const taskId = created.structuredContent?.task.id

    const completed = await callTool('complete_task', { taskId })
    expect(completed.structuredContent?.task.status).toBe('done')

    const listed = await callTool('list_tasks', { status: 'done' })
    expect(listed.structuredContent?.total).toBe(1)

    const deleted = await callTool('delete_task', { taskId })
    expect(deleted.isError).toBe(false)

    const missing = await callTool('get_task', { taskId })
    expect(missing).toMatchObject({ isError: true, structuredContent: { message: 'task not found' } })
  })

  it('rejects invalid arguments', async () => {
    const result = await callTool('get_task', { taskId: 'not-a-uuid' })

    expect(result.isError).toBe(true)
  })

  it('should declare honest tool annotations', async () => {
    const { tools } = await client.listTools()
    const byName = Object.fromEntries(tools.map((tool) => [tool.name, tool.annotations]))

    for (const name of ['whoami', 'list_tasks', 'get_task']) {
      expect(byName[name]?.readOnlyHint).toBe(true)
    }
    expect(byName.delete_task?.destructiveHint).toBe(true)
    expect(byName.create_task?.readOnlyHint).toBe(false)
  })

  it('should return tool errors (not protocol errors) when unauthenticated', async () => {
    const anonymous = new Client({ name: 'anonymous', version: '1.0.0' })
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await createMcpServer({ resolveAuth: () => undefined }).connect(serverTransport)
    await anonymous.connect(clientTransport)

    const result = (await anonymous.callTool({ name: 'list_tasks', arguments: {} })) as ToolResult

    expect(result).toMatchObject({ isError: true, structuredContent: { message: 'authentication required' } })
    await anonymous.close()
  })

  it('should apply schema defaults and validation before reaching the controller', async () => {
    const listed = await callTool('list_tasks')
    expect(listed.structuredContent).toMatchObject({ page: 1, perPage: 20 })

    const invalid = await callTool('list_tasks', { perPage: 1000 })
    expect(invalid.isError).toBe(true)
  })
})
