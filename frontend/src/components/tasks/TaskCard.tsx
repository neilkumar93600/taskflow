'use client'

import { Pencil, Trash2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Task } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'

interface TaskCardProps {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-primary-200 transition-all duration-150">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <button
          onClick={onToggle}
          className="flex-shrink-0 mt-0.5"
          title="Toggle status"
        >
          <Badge status={task.status} className="cursor-pointer hover:opacity-80 transition-opacity" />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          {task.dueDate ? (
            <span>Due {formatDate(task.dueDate)}</span>
          ) : (
            <span>Added {formatDate(task.createdAt)}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/tasks/${task.id}`}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-150"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger-light rounded-md transition-all duration-150"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/dashboard/tasks/${task.id}`}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-all duration-150"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
