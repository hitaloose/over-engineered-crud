import 'reflect-metadata'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { Jwt } from '@/infra/cryptography/jwt'
import { dataSource } from '@/infra/libs/typeorm/config'
import { server } from '@/main/http/server'

const registerAndGetToken = async (username: string) => {
  const response = await request(server)
    .post('/auth/register')
    .send({ name: username, username, email: `${username}@example.com`, password: 'secret123', passwordConfirmation: 'secret123' })

  return response.body.token as string
}

describe('authorization (integration)', () => {
  let aliceToken: string
  let bobToken: string
  let aliceTaskId: string

  beforeAll(async () => {
    await dataSource.initialize()

    aliceToken = await registerAndGetToken('alice')
    bobToken = await registerAndGetToken('bob')

    const created = await request(server).post('/tasks').set('Authorization', `Bearer ${aliceToken}`).send({ title: 'alice secret' })
    aliceTaskId = created.body.task.id
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("a user cannot touch another user's tasks", () => {
    const asBob = () => ({ Authorization: `Bearer ${bobToken}` })

    it('read', async () => {
      expect((await request(server).get(`/tasks/${aliceTaskId}`).set(asBob())).status).toBe(404)
    })

    it('list', async () => {
      const response = await request(server).get('/tasks').set(asBob())

      expect(response.body).toMatchObject({ tasks: [], total: 0 })
    })

    it('update', async () => {
      expect((await request(server).patch(`/tasks/${aliceTaskId}`).set(asBob()).send({ status: 'done' })).status).toBe(404)
    })

    it('delete', async () => {
      expect((await request(server).delete(`/tasks/${aliceTaskId}`).set(asBob())).status).toBe(404)
    })

    it('reassign ownership through the body', async () => {
      const created = await request(server).post('/tasks').set(asBob()).send({ title: 'sneaky', userId: 'alice-id' })

      expect(created.status).toBe(201)
      expect(created.body.task.userId).not.toBe('alice-id')
    })

    it("and the owner's task is unchanged", async () => {
      const response = await request(server).get(`/tasks/${aliceTaskId}`).set('Authorization', `Bearer ${aliceToken}`)

      expect(response.body.task).toMatchObject({ title: 'alice secret', status: 'todo' })
    })
  })

  describe('tokens', () => {
    it.each([
      ['no header', undefined],
      ['wrong scheme', 'Basic abc'],
      ['malformed token', 'Bearer not-a-jwt'],
    ])('should reject %s', async (_name, authorization) => {
      const req = request(server).get('/auth/me')
      const response = await (authorization ? req.set('Authorization', authorization) : req)

      expect(response.status).toBe(401)
    })

    it('should reject a token signed with another secret', async () => {
      const forged = await new Jwt('attacker-secret').encode({ sub: 'whatever' })

      expect((await request(server).get('/auth/me').set('Authorization', `Bearer ${forged}`)).status).toBe(401)
    })

    it('should 404 on /auth/me when the token user no longer exists', async () => {
      const orphan = await new Jwt('test-secret').encode({ sub: '00000000-0000-4000-8000-000000000000' })

      expect((await request(server).get('/auth/me').set('Authorization', `Bearer ${orphan}`)).status).toBe(404)
    })
  })

  describe('register validation', () => {
    it('should 400 with field details on invalid payload', async () => {
      const response = await request(server).post('/auth/register').send({ email: 'not-an-email', password: '1' })

      expect(response.status).toBe(400)
      expect(Object.keys(response.body.details)).toEqual(expect.arrayContaining(['name', 'username', 'email', 'password']))
    })

    it('should 422 when passwords do not match', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({ name: 'c', username: 'carol', email: 'carol@example.com', password: 'secret123', passwordConfirmation: 'different' })

      expect(response.status).toBe(422)
    })

    it('should 422 on duplicate username with a different email', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({ name: 'a', username: 'alice', email: 'new@example.com', password: 'secret123', passwordConfirmation: 'secret123' })

      expect(response.status).toBe(422)
    })
  })

  describe('MCP endpoint', () => {
    it('should answer 405 for GET and DELETE (stateless server, no SSE stream)', async () => {
      expect((await request(server).get('/mcp').set('Authorization', `Bearer ${aliceToken}`)).status).toBe(405)
      expect((await request(server).delete('/mcp').set('Authorization', `Bearer ${aliceToken}`)).status).toBe(405)
    })

    it("should scope MCP tools to the bearer's user", async () => {
      const response = await request(server)
        .post('/mcp')
        .set({ Authorization: `Bearer ${bobToken}`, Accept: 'application/json, text/event-stream' })
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_task', arguments: { taskId: aliceTaskId } } })

      expect(response.body.result).toMatchObject({ isError: true, structuredContent: { message: 'task not found' } })
    })
  })

  it('should expose a health check without auth', async () => {
    expect((await request(server).get('/health')).body).toEqual({ status: 'ok' })
  })
})
