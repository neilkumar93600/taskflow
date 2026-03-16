import { prisma } from '../../db/client'
import { hashPassword, comparePassword } from '../../utils/password'
import { signAccessToken, signRefreshToken, hashToken, addDays } from '../../utils/jwt'
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../../utils/apiResponse'
import { RegisterInput, LoginInput } from './auth.schema'

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  })
  if (existing) throw new ConflictError('Email already registered')

  const hashedPassword = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  return user
}

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new UnauthorizedError('Invalid email or password')

  const isValid = await comparePassword(input.password, user.password)
  if (!isValid) throw new UnauthorizedError('Invalid email or password')

  const accessToken = signAccessToken({ userId: user.id, email: user.email })
  const rawRefreshToken = signRefreshToken()

  await prisma.refreshToken.create({
    data: {
      token: hashToken(rawRefreshToken),
      userId: user.id,
      expiresAt: addDays(new Date(), 7),
    },
  })

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  }
}

export const refresh = async (rawToken: string) => {
  const hashed = hashToken(rawToken)

  const stored = await prisma.refreshToken.findUnique({
    where: { token: hashed },
  })

  if (!stored) throw new UnauthorizedError('Invalid refresh token')
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } })
    throw new UnauthorizedError('Refresh token expired')
  }

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
    select: { id: true, email: true },
  })
  if (!user) throw new NotFoundError('User not found')

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { id: stored.id } })

  const newRawToken = signRefreshToken()
  await prisma.refreshToken.create({
    data: {
      token: hashToken(newRawToken),
      userId: user.id,
      expiresAt: addDays(new Date(), 7),
    },
  })

  const accessToken = signAccessToken({ userId: user.id, email: user.email })

  return { accessToken, refreshToken: newRawToken }
}

export const logout = async (userId: string, rawToken?: string) => {
  if (rawToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: hashToken(rawToken) },
    })
  } else {
    // Logout from all devices
    await prisma.refreshToken.deleteMany({ where: { userId } })
  }
}
