import 'reflect-metadata'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { dataSource } from '@/infra/libs/typeorm/config'
import { server } from '@/main/http/server'

const credentials = { name: 'Ada Lovelace', username: 'ada', email: 'ada@example.com', password: 'secret123' }

describe('HTTP API (integration)', () => {
  let token: string

  beforeAll(async () => {
    await dataSource.initialize()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('registers, rejects duplicates and logs in', async () => {
    const register = await request(server)
      .post('/auth/register')
      .send({ ...credentials, passwordConfirmation: credentials.password })

    expect(register.status).toBe(201)
    expect(register.body.user).not.toHaveProperty('hashedPassword')

    const duplicate = await request(server)
      .post('/auth/register')
      .send({ ...credentials, email: 'other@example.com', passwordConfirmation: credentials.password })

    expect(duplicate.status).toBe(422)

    const badLogin = await request(server).post('/auth/login').send({ email: credentials.email, password: 'wrong' })
    expect(badLogin.status).toBe(401)

    const login = await request(server).post('/auth/login').send({ email: credentials.email, password: credentials.password })
    expect(login.status).toBe(200)
    token = login.body.token

    const me = await request(server).get('/auth/me').set('Authorization', `Bearer ${token}`)
    expect(me.body.user.username).toBe('ada')
  })

  it('requires authentication for tasks', async () => {
    const response = await request(server).get('/tasks')

    expect(response.status).toBe(401)
  })

  it('runs the full task lifecycle', async () => {
    const auth = { Authorization: `Bearer ${token}` }

    const created = await request(server).post('/tasks').set(auth).send({ title: 'Ship the MCP adapter', dueDate: '2030-01-01' })
    expect(created.status).toBe(201)
    expect(created.body.task).toMatchObject({ title: 'Ship the MCP adapter', status: 'todo' })

    const taskId = created.body.task.id

    const invalid = await request(server).post('/tasks').set(auth).send({ title: '' })
    expect(invalid.status).toBe(400)
    expect(invalid.body.details.title).toBeDefined()

    const updated = await request(server).patch(`/tasks/${taskId}`).set(auth).send({ status: 'done' })
    expect(updated.body.task.status).toBe('done')

    const listed = await request(server).get('/tasks?status=done').set(auth)
    expect(listed.body).toMatchObject({ total: 1, page: 1, perPage: 20 })

    const deleted = await request(server).delete(`/tasks/${taskId}`).set(auth)
    expect(deleted.status).toBe(204)

    const missing = await request(server).get(`/tasks/${taskId}`).set(auth)
    expect(missing.status).toBe(404)
  })

  it('serves MCP over Streamable HTTP behind the same bearer auth', async () => {
    const mcpHeaders = { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' }
    const call = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'create_task', arguments: { title: 'From MCP' } } }

    const unauthorized = await request(server).post('/mcp').set(mcpHeaders).send(call)
    expect(unauthorized.status).toBe(401)

    const response = await request(server)
      .post('/mcp')
      .set({ ...mcpHeaders, Authorization: `Bearer ${token}` })
      .send(call)

    expect(response.status).toBe(200)
    expect(response.body.result.isError).toBe(false)
    expect(response.body.result.structuredContent.task.title).toBe('From MCP')
  })
})
