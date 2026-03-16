import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { sendSuccess } from '../../utils/apiResponse'
import { env } from '../../config/env'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.register(req.body)
    sendSuccess(res, { message: 'User registered successfully', user }, 201)
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    sendSuccess(res, { accessToken, user })
  } catch (err) {
    next(err)
  }
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      res.status(401).json({ status: 'error', message: 'No refresh token provided' })
      return
    }

    const { accessToken, refreshToken } = await authService.refresh(token)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    sendSuccess(res, { accessToken })
  } catch (err) {
    next(err)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawToken = req.cookies?.refreshToken
    await authService.logout(req.user!.id, rawToken)
    res.clearCookie('refreshToken')
    sendSuccess(res, { message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}
