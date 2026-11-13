import { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import { ZodRawShape } from 'zod'

import { createTaskSchema, listTasksSchema, taskIdSchema, updateTaskSchema } from '@/infra/libs/zod/task-schemas'
import { McpArgsMapper } from '@/main/adapters/mcp-tool-adapter'
import { factoryGetMeController } from '@/main/factories/controllers/factory-auth-controllers'
import {
  factoryCreateTaskController,
  factoryDeleteTaskController,
  factoryGetTaskController,
  factoryListTasksController,
  factoryUpdateTaskController,
} from '@/main/factories/controllers/factory-task-controllers'
import { Controller } from '@/presentation/contracts/controller'

export type McpTool = {
  name: string
  title: string
  description: string
  inputSchema: ZodRawShape
  annotations: ToolAnnotations
  controller: () => Controller
  mapArgs?: McpArgsMapper<Record<string, unknown>>
}

/** The tool catalog. Input schemas are the same zod schemas the HTTP API validates with. */
export const mcpTools: McpTool[] = [
  {
    name: 'whoami',
    title: 'Who am I',
    description: 'Returns the authenticated user.',
    inputSchema: {},
    annotations: { readOnlyHint: true },
    controller: factoryGetMeController,
  },
  {
    name: 'list_tasks',
    title: 'List tasks',
    description: 'Lists the authenticated user tasks, newest first. Supports filtering by status and pagination.',
    inputSchema: listTasksSchema.shape,
    annotations: { readOnlyHint: true },
    controller: factoryListTasksController,
  },
  {
    name: 'get_task',
    title: 'Get task',
    description: 'Returns a single task by id.',
    inputSchema: taskIdSchema.shape,
    annotations: { readOnlyHint: true },
    controller: factoryGetTaskController,
  },
  {
    name: 'create_task',
    title: 'Create task',
    description: 'Creates a task for the authenticated user. Status defaults to "todo".',
    inputSchema: createTaskSchema.shape,
    annotations: { readOnlyHint: false, idempotentHint: false },
    controller: factoryCreateTaskController,
  },
  {
    name: 'update_task',
    title: 'Update task',
    description: 'Updates any subset of a task fields (title, description, status, dueDate).',
    inputSchema: updateTaskSchema.shape,
    annotations: { readOnlyHint: false, idempotentHint: true },
    controller: factoryUpdateTaskController,
  },
  {
    name: 'complete_task',
    title: 'Complete task',
    description: 'Marks a task as done.',
    inputSchema: taskIdSchema.shape,
    annotations: { readOnlyHint: false, idempotentHint: true },
    controller: factoryUpdateTaskController,
    mapArgs: (args) => ({ body: { ...args, status: 'done' } }),
  },
  {
    name: 'delete_task',
    title: 'Delete task',
    description: 'Permanently deletes a task.',
    inputSchema: taskIdSchema.shape,
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
    controller: factoryDeleteTaskController,
  },
]
