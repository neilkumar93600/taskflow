import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { requestLogger } from './middleware/requestLogger'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './modules/auth/auth.routes'
import tasksRoutes from './modules/tasks/tasks.routes'

const app = express()

// Security headers
app.use(helmet())

// CORS — allow only the frontend origin
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true, // allow cookies
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parsers
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Request logging
app.use(requestLogger)

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/v1/auth',  authRoutes)
app.use('/api/v1/tasks', tasksRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' })
})

// Global error handler (must be last)
app.use(errorHandler)

export default app
