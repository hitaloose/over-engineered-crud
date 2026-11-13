import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from '@/infra/libs/zod/task-schemas'

describe('createTaskSchema', () => {
  it('should trim the title and coerce the due date', () => {
    const parsed = createTaskSchema.parse({ title: '  write tests  ', dueDate: '2030-01-01' })

    expect(parsed.title).toBe('write tests')
    expect(parsed.dueDate).toEqual(new Date('2030-01-01'))
  })

  it.each([{ title: '' }, { title: '   ' }, { title: 'x'.repeat(201) }, {}])('should reject invalid title %j', (input) => {
    expect(createTaskSchema.safeParse(input).success).toBe(false)
  })

  it('should reject unknown statuses and invalid dates', () => {
    expect(createTaskSchema.safeParse({ title: 't', status: 'archived' }).success).toBe(false)
    expect(createTaskSchema.safeParse({ title: 't', dueDate: 'not a date' }).success).toBe(false)
  })

  it('should accept null to clear optional fields', () => {
    expect(createTaskSchema.parse({ title: 't', description: null, dueDate: null })).toMatchObject({ description: null, dueDate: null })
  })
})

describe('updateTaskSchema', () => {
  it('should require a valid taskId but nothing else', () => {
    const taskId = faker.string.uuid()

    expect(updateTaskSchema.parse({ taskId })).toEqual({ taskId })
    expect(updateTaskSchema.safeParse({ title: 't' }).success).toBe(false)
  })
})

describe('taskIdSchema', () => {
  it('should reject non-uuid ids', () => {
    expect(taskIdSchema.safeParse({ taskId: '1' }).success).toBe(false)
  })
})

describe('listTasksSchema', () => {
  it('should apply pagination defaults', () => {
    expect(listTasksSchema.parse({})).toEqual({ page: 1, perPage: 20 })
  })

  it('should coerce query string numbers', () => {
    expect(listTasksSchema.parse({ page: '3', perPage: '50', status: 'done' })).toEqual({ page: 3, perPage: 50, status: 'done' })
  })

  it.each([{ page: '0' }, { perPage: '101' }, { perPage: '1.5' }])('should reject out of range pagination %j', (input) => {
    expect(listTasksSchema.safeParse(input).success).toBe(false)
  })
})
