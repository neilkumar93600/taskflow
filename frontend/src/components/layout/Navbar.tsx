'use client'

import { LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user } = useAuthStore()
  const { logout, isLoggingOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6">
      <div className="flex items-center flex-1 gap-4">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900">
          Task<span className="text-primary-600">Flow</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* User info */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <span className="font-medium">{user?.name}</span>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900
                     px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
