import { Request, Response, NextFunction } from 'express'
import * as tasksService from './tasks.service'
import { sendSuccess } from '../../utils/apiResponse'

const getParamAsString = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await tasksService.getTasks(req.user!.id, req.query as any)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.getTaskById(
      getParamAsString(req.params.id),
      req.user!.id
    )
    sendSuccess(res, { task })
  } catch (err) {
    next(err)
  }
}

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.createTask(req.user!.id, req.body)
    sendSuccess(res, { task }, 201)
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.updateTask(
      getParamAsString(req.params.id),
      req.user!.id,
      req.body
    )
    sendSuccess(res, { task })
  } catch (err) {
    next(err)
  }
}

export const toggleTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.toggleTaskStatus(
      getParamAsString(req.params.id),
      req.user!.id
    )
    sendSuccess(res, { task })
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await tasksService.deleteTask(getParamAsString(req.params.id), req.user!.id)
    sendSuccess(res, { message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
}
