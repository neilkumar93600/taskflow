import { getTasks, createTask, toggleTaskStatus, deleteTask } from '../modules/tasks/tasks.service'
import { prisma } from '../db/client'
import { ForbiddenError, NotFoundError } from '../utils/apiResponse'

jest.mock('../db/client', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: null,
  status: 'pending' as const,
  dueDate: null,
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('TasksService', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('getTasks()', () => {
    it('returns paginated tasks for a user', async () => {
      ;(mockPrisma.$transaction as jest.Mock).mockResolvedValue([[mockTask], 1])

      const result = await getTasks('user-1', { page: 1, limit: 10 })
      expect(result.tasks).toHaveLength(1)
      expect(result.pagination.total).toBe(1)
      expect(result.pagination.totalPages).toBe(1)
    })
  })

  describe('createTask()', () => {
    it('creates a task with the given userId', async () => {
      ;(mockPrisma.task.create as jest.Mock).mockResolvedValue(mockTask)

      const task = await createTask('user-1', { title: 'Test Task' })
      expect(task.userId).toBe('user-1')
    })
  })

  describe('toggleTaskStatus()', () => {
    it('cycles pending → in_progress', async () => {
      ;(mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask)
      ;(mockPrisma.task.update as jest.Mock).mockResolvedValue({ ...mockTask, status: 'in_progress' })

      const updated = await toggleTaskStatus('task-1', 'user-1')
      expect(updated.status).toBe('in_progress')
    })

    it('throws ForbiddenError when userId does not match', async () => {
      ;(mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask)

      await expect(toggleTaskStatus('task-1', 'other-user')).rejects.toThrow(ForbiddenError)
    })

    it('throws NotFoundError for unknown task', async () => {
      ;(mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(toggleTaskStatus('bad-id', 'user-1')).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteTask()', () => {
    it('deletes the task when user is the owner', async () => {
      ;(mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask)
      ;(mockPrisma.task.delete as jest.Mock).mockResolvedValue(mockTask)

      await expect(deleteTask('task-1', 'user-1')).resolves.toBeUndefined()
    })
  })
})
