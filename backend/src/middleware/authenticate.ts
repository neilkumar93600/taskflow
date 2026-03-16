import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { UnauthorizedError } from '../utils/apiResponse'
import { prisma } from '../db/client'

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    })

    if (!user) throw new UnauthorizedError('User not found')

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}
