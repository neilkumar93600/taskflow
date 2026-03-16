import { env } from './src/config/env'
import app from './src/app'
import { prisma } from './src/db/client'

const start = async () => {
  try {
    await prisma.$connect()
    console.log('✅  Database connected')

    app.listen(env.PORT, () => {
      console.log(`🚀  Server running on http://localhost:${env.PORT}`)
      console.log(`📡  API base: http://localhost:${env.PORT}/api/v1`)
      console.log(`🌍  Environment: ${env.NODE_ENV}`)
    })
  } catch (err) {
    console.error('❌  Failed to start server:', err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑  Shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

start()
