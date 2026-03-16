'use client'

import { CheckCircle2, Circle, Clock, ListTodo } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { Skeleton } from '@/components/ui/Skeleton'

export function TaskStats() {
  const { data: all,         isLoading: l1 } = useTasks({ page: 1, limit: 1 })
  const { data: pending,     isLoading: l2 } = useTasks({ page: 1, limit: 1, status: 'pending' })
  const { data: inProgress,  isLoading: l3 } = useTasks({ page: 1, limit: 1, status: 'in_progress' })
  const { data: completed,   isLoading: l4 } = useTasks({ page: 1, limit: 1, status: 'completed' })

  const isLoading = l1 || l2 || l3 || l4

  const stats = [
    {
      label: 'Total',
      value: all?.pagination.total ?? 0,
      icon: ListTodo,
      color: 'text-gray-500',
      bg: 'bg-gray-100',
    },
    {
      label: 'Pending',
      value: pending?.pagination.total ?? 0,
      icon: Circle,
      color: 'text-warning-dark',
      bg: 'bg-warning-light',
    },
    {
      label: 'In Progress',
      value: inProgress?.pagination.total ?? 0,
      icon: Clock,
      color: 'text-info-dark',
      bg: 'bg-info-light',
    },
    {
      label: 'Completed',
      value: completed?.pagination.total ?? 0,
      icon: CheckCircle2,
      color: 'text-success-dark',
      bg: 'bg-success-light',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3"
        >
          <div className={`${bg} p-2 rounded-lg flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
