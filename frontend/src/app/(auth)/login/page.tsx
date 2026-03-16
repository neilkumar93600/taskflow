import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Login — TaskFlow' }

export default function LoginPage() {
  return <LoginForm />
}
