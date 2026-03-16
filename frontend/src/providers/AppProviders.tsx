'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#065f46',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
            },
          },
          error: {
            style: {
              background: '#991b1b',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
