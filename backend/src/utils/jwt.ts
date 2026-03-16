import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env'
import { JwtPayload } from '../types'

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const signRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex')
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload
}

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
