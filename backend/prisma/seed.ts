import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Seeding database...')

  // Clean up
  await prisma.refreshToken.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@taskflow.dev',
      password: await hashPassword('Demo@1234'),
      tasks: {
        createMany: {
          data: [
            { title: 'Setup project structure',  status: 'completed',   createdAt: new Date('2025-01-01') },
            { title: 'Build authentication API',  status: 'in_progress', createdAt: new Date('2025-01-02') },
            { title: 'Build task dashboard',      status: 'pending',     createdAt: new Date('2025-01-03'), dueDate: new Date('2025-06-30') },
            { title: 'Write unit tests',          status: 'pending',     createdAt: new Date('2025-01-04'), dueDate: new Date('2025-07-15') },
            { title: 'Deploy to production',      status: 'pending',     createdAt: new Date('2025-01-05'), description: 'Set up Railway + Vercel + Neon' },
          ],
        },
      },
    },
  })

  console.log(`✅  Created user: ${user.email} (password: Demo@1234)`)
  console.log('✅  Created 5 sample tasks')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
