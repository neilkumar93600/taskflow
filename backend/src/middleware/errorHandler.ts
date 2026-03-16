import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/apiResponse'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.name}: ${err.message}`)

  if (err instanceof AppError || 'statusCode' in err) {
    const e = err as AppError
    res.status(e.statusCode).json({
      status: 'error',
      message: e.message,
      ...(e.errors && { errors: e.errors }),
    })
    return
  }

  // JsonWebTokenError, TokenExpiredError
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ status: 'error', message: 'Invalid or expired token' })
    return
  }

  // Prisma unique constraint violation
  if ((err as any).code === 'P2002') {
    res.status(409).json({ status: 'error', message: 'Resource already exists' })
    return
  }

  res.status(500).json({ status: 'error', message: 'Internal server error' })
}
