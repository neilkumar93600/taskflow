import { Response } from 'express'

export const sendSuccess = (
  res: Response,
  data: object,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({ status: 'success', ...data })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: object[]
): Response => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
  })
}

// Custom error classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: object[]
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: object[]) {
    super(message, 400, errors)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}
