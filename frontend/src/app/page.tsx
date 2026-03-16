'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function RootPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [accessToken, router])

  return null
}
