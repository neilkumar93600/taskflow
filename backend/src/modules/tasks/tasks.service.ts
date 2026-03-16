import { TaskStatus } from '@prisma/client'
import { prisma } from '../../db/client'
import { NotFoundError, ForbiddenError } from '../../utils/apiResponse'
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
} from './tasks.schema'

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  pending:     'in_progress',
  in_progress: 'completed',
  completed:   'pending',
}

const assertOwner = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new NotFoundError('Task not found')
  if (task.userId !== userId) throw new ForbiddenError('Access denied')
  return task
}

export const getTasks = async (userId: string, query: TaskQueryInput) => {
  const { page, limit, status, search } = query

  const where = {
    userId,
    ...(status && { status }),
    ...(search && {
      title: { contains: search, mode: 'insensitive' as const },
    }),
  }

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ])

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const getTaskById = async (id: string, userId: string) => {
  return assertOwner(id, userId)
}

export const createTask = async (userId: string, input: CreateTaskInput) => {
  return prisma.task.create({
    data: { ...input, userId },
  })
}

export const updateTask = async (
  id: string,
  userId: string,
  input: UpdateTaskInput
) => {
  await assertOwner(id, userId)
  return prisma.task.update({ where: { id }, data: input })
}

export const toggleTaskStatus = async (id: string, userId: string) => {
  const task = await assertOwner(id, userId)
  const nextStatus = STATUS_CYCLE[task.status]
  return prisma.task.update({ where: { id }, data: { status: nextStatus } })
}

export const deleteTask = async (id: string, userId: string) => {
  await assertOwner(id, userId)
  await prisma.task.delete({ where: { id } })
}
