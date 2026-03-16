import { TaskStatus } from '@/types'

export const statusBadgeClass: Record<TaskStatus, string> = {
  pending:     'bg-warning-light text-warning-dark',
  in_progress: 'bg-info-light text-info-dark',
  completed:   'bg-success-light text-success-dark',
}

export const statusLabel: Record<TaskStatus, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
}
