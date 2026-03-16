import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

type ValidateTarget = 'body' | 'query' | 'params'

export const validate =
  (schema: ZodSchema, target: ValidateTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target])
      req[target] = parsed
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        next({
          name: 'ValidationError',
          message: 'Validation failed',
          statusCode: 400,
          errors,
        })
      } else {
        next(err)
      }
    }
  }
