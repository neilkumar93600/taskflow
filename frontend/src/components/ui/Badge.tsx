import { TaskStatus } from '@/types'
import { cn } from '@/utils/cn'

interface BadgeProps {
  status: TaskStatus
  className?: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning-light text-warning-dark',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-info-light text-info-dark',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success-light text-success-dark',
  },
}

export function Badge({ status, className }: BadgeProps) {
  const { label, className: statusClass } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClass,
        className
      )}
    >
      {label}
    </span>
  )
}
