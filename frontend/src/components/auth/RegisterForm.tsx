'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = ({ name, email, password }: FormData) =>
    registerUser({ name, email, password })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Create account</h2>
      <p className="text-sm text-gray-500 mb-6">Start managing your tasks</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          {...register('name')}
          id="name"
          label="Full name"
          placeholder="Jane Doe"
          autoComplete="name"
          error={errors.name?.message}
        />

        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
        />

        <Input
          {...register('password')}
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
        />

        <Input
          {...register('confirmPassword')}
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isRegistering}
          className="w-full"
        >
          {isRegistering ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
