'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { TaskStats } from '@/components/tasks/TaskStats'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskTable } from '@/components/tasks/TaskTable'
import { TaskEmptyState } from '@/components/tasks/TaskEmptyState'
import { DeleteTaskModal } from '@/components/tasks/DeleteTaskModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/useTasks'
import { useDeleteTask } from '@/hooks/useDeleteTask'
import { useToggleTask } from '@/hooks/useToggleTask'
import { Task, TaskFilters as Filters } from '@/types'

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 10 })
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const { data, isLoading } = useTasks(filters)
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { mutate: toggleTask } = useToggleTask()

  const tasks = data?.tasks ?? []
  const pagination = data?.pagination

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleConfirmDelete = () => {
    if (!taskToDelete) return
    deleteTask(taskToDelete.id, { onSuccess: () => setTaskToDelete(null) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : '—'}
          </p>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <TaskStats />

      {/* Filters */}
      <TaskFilters filters={filters} onChange={handleFilterChange} />

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <TaskEmptyState hasFilters={!!(filters.status || filters.search)} />
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => setTaskToDelete(task)}
              />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block">
            <TaskTable
              tasks={tasks}
              onToggle={(id) => toggleTask(id)}
              onDelete={(task) => setTaskToDelete(task)}
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      <DeleteTaskModal
        task={taskToDelete}
        isOpen={!!taskToDelete}
        isDeleting={isDeleting}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
