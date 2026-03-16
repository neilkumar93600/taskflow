import { Router } from 'express'
import * as tasksController from './tasks.controller'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validate'
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdSchema,
} from './tasks.schema'

const router = Router()

// All task routes require authentication
router.use(authenticate)

router.get('/',           validate(taskQuerySchema, 'query'), tasksController.getTasks)
router.post('/',          validate(createTaskSchema),         tasksController.createTask)
router.get('/:id',        validate(taskIdSchema, 'params'),   tasksController.getTaskById)
router.patch('/:id',      validate(taskIdSchema, 'params'),
                          validate(updateTaskSchema),         tasksController.updateTask)
router.patch('/:id/toggle', validate(taskIdSchema, 'params'), tasksController.toggleTaskStatus)
router.delete('/:id',     validate(taskIdSchema, 'params'),   tasksController.deleteTask)

export default router
