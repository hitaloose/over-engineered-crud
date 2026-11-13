import { z } from 'zod'

import { TASK_STATUSES } from '@/domain/entities/task'

const taskStatus = z.enum(TASK_STATUSES).describe('Task status')

const taskFields = {
  title: z.string().trim().min(1).max(200).describe('Short title of the task'),
  description: z.string().max(2000).nullable().optional().describe('Optional longer description'),
  status: taskStatus.optional(),
  dueDate: z.coerce.date().nullable().optional().describe('Due date in ISO 8601 format'),
}

export const taskIdSchema = z.object({
  taskId: z.string().uuid().describe('Task id (uuid)'),
})

export const createTaskSchema = z.object(taskFields)

export const updateTaskSchema = taskIdSchema.extend({
  title: taskFields.title.optional(),
  description: taskFields.description,
  status: taskFields.status,
  dueDate: taskFields.dueDate,
})

export const listTasksSchema = z.object({
  status: taskStatus.optional().describe('Filter by status'),
  page: z.coerce.number().int().min(1).default(1).describe('Page number, starting at 1'),
  perPage: z.coerce.number().int().min(1).max(100).default(20).describe('Items per page (max 100)'),
})
