import 'reflect-metadata'

import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { dataSource } from '@/infra/libs/typeorm/config'
import { TaskTypeorm } from '@/infra/libs/typeorm/entities/task-typeorm'
import { UserTypeorm } from '@/infra/libs/typeorm/entities/user-typeorm'
import { TypeormTaskRepository } from '@/infra/repositories/typeorm-task-repository'
import { TypeormUserRepository } from '@/infra/repositories/typeorm-user-repository'

const userRepository = new TypeormUserRepository()
const taskRepository = new TypeormTaskRepository()

const insertUser = (override: Partial<{ username: string; email: string }> = {}) =>
  userRepository.insert({
    name: faker.person.fullName(),
    username: override.username ?? faker.internet.username(),
    email: override.email ?? faker.internet.email(),
    hashedPassword: 'hash',
  })

const insertTask = (userId: string, override: Partial<{ title: string; status: 'todo' | 'doing' | 'done' }> = {}) =>
  taskRepository.insert({ userId, title: override.title ?? faker.lorem.words(3), description: null, status: override.status ?? 'todo', dueDate: null })

describe('TypeORM repositories (integration)', () => {
  beforeAll(async () => {
    await dataSource.initialize()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe('TypeormUserRepository', () => {
    it('should generate id and timestamps on insert', async () => {
      const user = await insertUser()

      expect(user.id).toMatch(/^[0-9a-f-]{36}$/)
      expect(user.createdAt).toBeInstanceOf(Date)
    })

    it('should find by username OR email', async () => {
      const user = await insertUser()

      expect((await userRepository.findByUsernameOrEmail({ username: user.username, email: 'nobody@x.com' }))?.id).toBe(user.id)
      expect((await userRepository.findByUsernameOrEmail({ username: 'nobody', email: user.email }))?.id).toBe(user.id)
      expect(await userRepository.findByUsernameOrEmail({ username: 'nobody', email: 'nobody@x.com' })).toBeUndefined()
    })

    it('should find by email and by id, returning undefined when missing', async () => {
      const user = await insertUser()

      expect((await userRepository.findByEmail(user.email))?.id).toBe(user.id)
      expect((await userRepository.findById(user.id))?.email).toBe(user.email)
      expect(await userRepository.findByEmail('missing@x.com')).toBeUndefined()
      expect(await userRepository.findById(faker.string.uuid())).toBeUndefined()
    })

    it('should enforce unique username and email at the database level', async () => {
      const user = await insertUser()

      await expect(insertUser({ username: user.username })).rejects.toThrow()
      await expect(insertUser({ email: user.email })).rejects.toThrow()
    })
  })

  describe('TypeormTaskRepository', () => {
    let userId: string
    let otherUserId: string

    beforeEach(async () => {
      userId = (await insertUser()).id
      otherUserId = (await insertUser()).id
    })

    it('should only find a task for its owner', async () => {
      const task = await insertTask(userId)

      expect((await taskRepository.findById({ id: task.id, userId }))?.id).toBe(task.id)
      expect(await taskRepository.findById({ id: task.id, userId: otherUserId })).toBeUndefined()
    })

    it('should list only the user tasks, newest first, with total and pagination', async () => {
      const tasks = []
      for (let i = 0; i < 5; i++) {
        const task = await insertTask(userId, { title: `task ${i}` })
        // SQLite timestamps have second precision, so set them explicitly to get a deterministic order.
        await dataSource.getRepository(TaskTypeorm).update(task.id, { createdAt: new Date(2030, 0, 1, 0, 0, i) })
        tasks.push(task)
      }
      await insertTask(otherUserId)

      const firstPage = await taskRepository.list({ userId, offset: 0, limit: 2 })
      const lastPage = await taskRepository.list({ userId, offset: 4, limit: 2 })

      expect(firstPage.total).toBe(5)
      expect(firstPage.tasks.map((task) => task.title)).toEqual(['task 4', 'task 3'])
      expect(lastPage.tasks.map((task) => task.title)).toEqual(['task 0'])
    })

    it('should filter by status', async () => {
      await insertTask(userId, { status: 'done' })
      await insertTask(userId, { status: 'todo' })

      const { tasks, total } = await taskRepository.list({ userId, status: 'done', offset: 0, limit: 10 })

      expect(total).toBe(1)
      expect(tasks[0].status).toBe('done')
    })

    it('should update only defined fields and allow clearing nullable ones', async () => {
      const task = await taskRepository.insert({ userId, title: 'original', description: 'desc', status: 'todo', dueDate: new Date('2030-01-01') })

      const updated = await taskRepository.update(task.id, { status: 'doing', title: undefined, dueDate: null })

      expect(updated).toMatchObject({ title: 'original', description: 'desc', status: 'doing', dueDate: null })
      expect((await taskRepository.findById({ id: task.id, userId }))?.status).toBe('doing')
    })

    it('should remove a task', async () => {
      const task = await insertTask(userId)

      await taskRepository.remove(task.id)

      expect(await taskRepository.findById({ id: task.id, userId })).toBeUndefined()
    })

    it('should delete a user tasks when the user is deleted (FK cascade)', async () => {
      const task = await insertTask(userId)

      await dataSource.getRepository(UserTypeorm).delete({ id: userId })

      expect(await dataSource.getRepository(TaskTypeorm).findOneBy({ id: task.id })).toBeNull()
    })

    it('should refuse a task for a non-existent user', async () => {
      await expect(insertTask(faker.string.uuid())).rejects.toThrow()
    })
  })
})
