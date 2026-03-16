import { z } from 'zod'
import { TaskStatus } from '@prisma/client'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.coerce.date().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.coerce.date().nullable().optional(),
})

export const taskQuerySchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(TaskStatus).optional(),
  search: z.string().max(200).optional(),
})

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskQueryInput  = z.infer<typeof taskQuerySchema>
