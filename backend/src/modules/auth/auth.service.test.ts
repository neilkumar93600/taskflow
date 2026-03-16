import { register, login, refresh, logout } from '../modules/auth/auth.service'
import { prisma } from '../db/client'
import { ConflictError, UnauthorizedError } from '../utils/apiResponse'
import { hashToken } from '../utils/jwt'

jest.mock('../db/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('AuthService', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('register()', () => {
    it('creates a user when email is unique', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(mockPrisma.user.create as jest.Mock).mockResolvedValue({
        id: 'uuid-1', name: 'Test', email: 'test@example.com', createdAt: new Date(),
      })

      const user = await register({ name: 'Test', email: 'test@example.com', password: 'Pass@1234' })
      expect(user.email).toBe('test@example.com')
    })

    it('throws ConflictError when email already exists', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' })

      await expect(
        register({ name: 'Test', email: 'dup@example.com', password: 'Pass@1234' })
      ).rejects.toThrow(ConflictError)
    })
  })

  describe('login()', () => {
    it('throws UnauthorizedError for unknown email', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        login({ email: 'nope@example.com', password: 'Pass@1234' })
      ).rejects.toThrow(UnauthorizedError)
    })
  })

  describe('refresh()', () => {
    it('throws UnauthorizedError for unknown token', async () => {
      ;(mockPrisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(refresh('fake-token')).rejects.toThrow(UnauthorizedError)
    })

    it('throws UnauthorizedError for expired token', async () => {
      ;(mockPrisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'tid',
        token: hashToken('some-token'),
        userId: 'uid',
        expiresAt: new Date('2000-01-01'), // expired
      })
      ;(mockPrisma.refreshToken.delete as jest.Mock).mockResolvedValue({})

      await expect(refresh('some-token')).rejects.toThrow(UnauthorizedError)
    })
  })
})
