import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Register — TaskFlow' }

export default function RegisterPage() {
  return <RegisterForm />
}
