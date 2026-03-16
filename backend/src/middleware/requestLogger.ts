import { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const color =
      status >= 500 ? '\x1b[31m' :
      status >= 400 ? '\x1b[33m' :
      status >= 200 ? '\x1b[32m' : '\x1b[0m'

    console.log(
      `${color}${req.method}\x1b[0m ${req.originalUrl} ${color}${status}\x1b[0m ${duration}ms`
    )
  })

  next()
}
