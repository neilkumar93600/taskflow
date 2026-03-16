import { ListTodo, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function TaskEmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ListTodo className="w-12 h-12 text-gray-300 mb-4" />
      {hasFilters ? (
        <>
          <h3 className="text-base font-medium text-gray-900 mb-1">
            No tasks match your filters
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or status filter.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-gray-900 mb-1">
            No tasks yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Create your first task to get started.
          </p>
          <Link href="/dashboard/tasks/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New Task
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
