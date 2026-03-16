'use client'

import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Task } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'

interface TaskTableProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (task: Task) => void
}

export function TaskTable({ tasks, onToggle, onDelete }: TaskTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
              Task
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
              Due Date
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
              Created
            </th>
            <th className="px-4 py-3 w-24" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              {/* Title + description */}
              <td className="px-4 py-3">
                <Link href={`/dashboard/tasks/${task.id}`} className="block">
                  <p
                    className={`font-medium ${
                      task.status === 'completed'
                        ? 'line-through text-gray-400'
                        : 'text-gray-900 group-hover:text-primary-600'
                    } transition-colors`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">
                      {task.description}
                    </p>
                  )}
                </Link>
              </td>

              {/* Status badge — clickable to toggle */}
              <td className="px-4 py-3">
                <button onClick={() => onToggle(task.id)} title="Click to cycle status">
                  <Badge status={task.status} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </button>
              </td>

              {/* Due date */}
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden lg:table-cell">
                {task.dueDate ? formatDate(task.dueDate) : '—'}
              </td>

              {/* Created at */}
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden lg:table-cell">
                {formatDate(task.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => onDelete(task)}
                    className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger-light rounded-md transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
