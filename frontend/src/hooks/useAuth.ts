'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

interface LoginPayload   { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string }

interface AuthResponse {
  accessToken: string
  user: User
}

export function useAuth() {
  const router = useRouter()
  const { setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),
    onSuccess: ({ accessToken, user }) => {
      setAuth(user, accessToken)
      toast.success(`Welcome back, ${user.name}!`)
      router.replace('/dashboard')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Login failed')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post('/auth/register', payload).then((r) => r.data),
    onSuccess: (_data, variables) => {
      toast.success('Account created! Please sign in.')
      router.replace('/login')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Registration failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout').then((r) => r.data),
    onSettled: () => {
      clearAuth()
      router.replace('/login')
    },
  })

  return {
    login:        loginMutation.mutate,
    isLoggingIn:  loginMutation.isPending,

    register:     registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    logout:       logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
