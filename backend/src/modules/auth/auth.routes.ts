import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as authController from './auth.controller'
import { validate } from '../../middleware/validate'
import { authenticate } from '../../middleware/authenticate'
import { registerSchema, loginSchema } from './auth.schema'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: 'error', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/register', authLimiter, validate(registerSchema), authController.register)
router.post('/login',    authLimiter, validate(loginSchema),    authController.login)
router.post('/refresh',  authController.refresh)
router.post('/logout',   authenticate,                          authController.logout)

export default router
